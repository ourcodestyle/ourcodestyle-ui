import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import lodash from 'lodash'
import { parse, addMinutes, isFuture, differenceInMilliseconds, addSeconds } from "date-fns"
import uuidv1 from 'uuid/v1'
import copyToClipboard from 'copy-to-clipboard'
import TimeAgo from 'react-timeago'

import {Spinner} from '@blueprintjs/core'

import { AppToaster } from '~/components/toaster'
import { RuboCopIcon } from '~/pure/linter-icons'

import { withCurrentUser } from '~/contexts'

import {
  Classes,
  Breadcrumb,
  Breadcrumbs,
  Boundary,
  Button,
  Intent,
  Menu,
  Icon,
  Tree,
  RadioGroup,
  Radio,
  Card,
  ControlGroup,
  InputGroup,
  Callout,
  Popover,
  Position,
  Tooltip
} from '@blueprintjs/core'

import Activity from '~/components/Activity/Activity'

import {HTMLTable} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import QueryComponent from '~/fuks/QueryComponent'
import SectionCard from '~/components/ui/SectionCard'
import { openModal } from '~/redux/globalActions'
import {
  expandCategory,
  collapseCategory,
  expandAll,
  collapseAll,
  setCategoryIds,
  setFilter,
  generateConfigFile,
  checkPopulatingComplete,
} from './redux/actions'
import { fConnect } from '~/utils/components'
import {delay} from '~/utils/sagas'
import StyleGuideGQL from './styleGuide.gql'
import UserIconWithName from '~/pure/UserIconWithName'
import {LanguageIcon} from '~/pure/icons'

class StyleGuideShow extends QueryComponent {

  // componentDidUpdate(prevProps) {
  //   if (this.state.delayFor) {
  //     this.enableGenerateButtonIn(this.state.delayFor)
  //   }
  // }

  // async enableGenerateButtonIn(delayMs) {
  //   await delay(delayMs)
  //   this.setState({delayFor: null})
  // }

  content(){
    const {isRulesPopulated, linter} = this.state.styleGuide

    if (linter && !isRulesPopulated) {
      return <div>
        {this.breadcrumps()}
        <div>
          Populating style guide with rules, please wait...
          <Spinner />
        </div>
      </div>
    }

    return <div>
        {this.breadcrumps()}
        {this.controls()}
        {this.description()}
        {this.rules()}
    </div>
  }

  query(){
    return StyleGuideGQL
  }

  queryVariables(){
    return { id: this.props.styleGuideId || this.props.match.params.styleGuideId }
  }

  queryLoaded({styleGuide}) {
    this.setState({styleGuide})
    if (!styleGuide.isRulesPopulated) {
      this.props.actions.checkPopulatingComplete({ styleGuideId: styleGuide.id })
    }
    this.props.actions.setCategoryIds({ categoryIds: _.map(styleGuide.categories, 'id') })
  }

  activity(){
    const scope = { styleGuideId: { value: this.state.styleGuide.id, type: 'ID!' } }
    return <Activity scope={scope} small perPage={10} />
  }

  breadcrumps(){
    const styleGuide = this.state.styleGuide
    const project = styleGuide.project

    const items = [
      { text: project.name, href: `/projects/${project.domain}` },
      { text: styleGuide.name, href: null },
    ]
    const renderCurrentBreadcrumb = ({ text, ...restProps }) => {
      return <strong>{text}</strong>
    }

    return <div style={{ marginTop: 10 }}>
      <Breadcrumbs
          items={items}
          currentBreadcrumbRenderer={renderCurrentBreadcrumb}
        />
    </div>
  }

  buildRuleNode(rule) {
    const styleGuide = this.state.styleGuide

    return {
      id: rule.id,
      label: <div><Link to={`/projects/${styleGuide.project.domain}/style-guides/${styleGuide.id}/rules/${rule.id}`}>
        {rule.name}
      </Link>
      </div>,
      icon: "dot"
    }
  }

  groups(){
    const props = this.props
    const styleGuide = this.state.styleGuide
    if (styleGuide.groups.length == 0){
      return null
    }

    const nodes = styleGuide.groups.map(group => {
      const childNodes = group.rules.map(this.buildRuleNode.bind(this))
      return {
        id: group.id,
        label: group.name,
        icon: "bookmark",
        isExpanded: true,
        hasCaret: false,
        childNodes
      }
    })

    return <div style={{marginBottom: 40}}>
            <Tree
              contents={nodes}
              className={Classes.ELEVATION_0}
            />
          </div>

  }

  filter() {
    const styleGuide = this.state.styleGuide
    const handleFilterChange = (event) => {
      this.setState({filterConsensusType: event.target.value})
    }

    const rules = styleGuide.rules
    const allCount = rules.length
    const withVotesCount = lodash.filter(rules, rule => rule.votesCount > 0 && !rule.fullConsensus && rule.consensusCount == 0).length
    const partialCount = lodash.filter(rules, rule => !rule.fullConsensus && rule.consensusCount > 0).length
    const fullCount = lodash.filter(rules, rule => rule.fullConsensus).length

    return <div>
      <div className="card-title">Filter</div>
      <RadioGroup
        onChange={handleFilterChange}
        selectedValue={this.state.filterConsensusType || "all"}
      >
        <Radio label={`All (${allCount})`} value="all" />
        <Radio label={`With Votes (${withVotesCount})`} value="votes" />
        <Radio label={`Partial Consensus (${partialCount})`} value="partial" />
        <Radio label={`Full Consensus (${fullCount})`} value="full" />
      </RadioGroup>
    </div>
  }

  getFeaturedRules(linter){
    if (linter && linter === 'rubocop') {
      return [
        'Performance/Size',
        'Style/BracesAroundHashParameters',
        'Style/AndOr',
        'Style/ArrayJoin',
        'Style/CaseEquality',
        'Style/LambdaCall',
        'Style/EachWithObject',
        'Layout/AccessModifierIndentation',
        'Layout/AlignParameters',
        'Layout/DotPosition',
        'Layout/EmptyLinesAroundBlockBody',
        'Layout/EndAlignment',
      ]
    } else {
      return []
    }
  }

  rules(){
    const styleGuide = this.state.styleGuide
    const filterConsensusType = this.state.filterConsensusType || "all"

    const buildCategory = (category, ruleNames = []) => {
      let rules = []
      if (category.id) {
        rules = lodash.filter(styleGuide.rules, rule => rule.categoryId && rule.categoryId == category.id)
      } else if (ruleNames.length > 0) {
        rules = lodash.filter(styleGuide.rules, rule => _.includes(ruleNames, rule.name))
      } else {
        rules = lodash.filter(styleGuide.rules, rule => !rule.categoryId)
      }

      if (filterConsensusType === "votes") {
        rules = lodash.filter(rules, rule => rule.votesCount > 0 && !rule.fullConsensus && rule.consensusCount == 0)
      }

      if (filterConsensusType === "partial") {
        rules = lodash.filter(rules, rule => !rule.fullConsensus && rule.consensusCount > 0)
      }

      if (filterConsensusType === "full") {
        rules = lodash.filter(rules, rule => rule.fullConsensus)
      }

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        rules,
      }
    }

    const consensusDisplay = (rule) => {
      const linter = this.state.styleGuide.linter
      let consensusToDisable = false
      if (rule.switchConsensusValue) {
        if (linter === 'rubocop') {
          consensusToDisable = rule.switchConsensusValue === 'false'
        }
        if (linter === 'eslint') {
          consensusToDisable = rule.switchConsensusValue === 'off'
        }
      }

      const fullConsensus = rule.consensusCount === rule.maxConsensusCount || consensusToDisable
      const iconIntent = fullConsensus ? Intent.SUCCESS : Intent.WARNING
      const icon = <Icon icon={IconNames.ENDORSED} intent={iconIntent} />

      return <div style={{display: 'inline-block'}}>
        {icon}
        { !fullConsensus && <span style={{marginLeft: 4}}>{rule.consensusCount} of {rule.maxConsensusCount}</span> }
        { consensusToDisable && <span style={{marginLeft: 4}}>OFF</span> }
      </div>
    }

    let categories = styleGuide.categories.map(category => {
      return buildCategory(category)
    })

    const featuredRules = this.getFeaturedRules(styleGuide.linter)
    if (featuredRules.length > 0) {
      categories.unshift(buildCategory({id: null, name: "Featured", icon: 'star'}, featuredRules))
    }

    categories.push(buildCategory({id: null, name: "No Category"}))
    const trimRuleName = rule => {
      if (styleGuide.linter === 'rubocop' && rule.name.indexOf('/') != -1) {
        const [categoryName, ruleName] = rule.name.split('/')
        return <span><span style={{color: '#888'}}>{categoryName}/</span><span>{ruleName}</span></span>
      }
      return rule.name
    }

    const buildCategoryBlock = (category) => {
      if (category.rules.length === 0) {
        if (!category.id) return null
        return <div key={category.name} style={{marginBottom: 70}}>
          <h2 className="section-title">{category.name}</h2>
          { category.description && <p>{category.description}</p> }
          <i>No rules in this category yet</i>
        </div>
      }

      return <div key={category.name} style={{marginBottom: 70}}>
        <h2 className="section-title" style={{ paddingLeft: (category.icon ? 40 : 0) }}>
          {category.icon && <div style={{position: 'absolute', marginTop: -25, marginLeft: -40}}><Icon icon={category.icon} iconSize={30} /></div>}
          {category.name}
        </h2>
        { category.description && <p>{category.description}</p> }
        <div>
          <table className="bp3-html-table bp3-html-table-striped" style={{width: 1180}}>
            <tbody>
            { _.sortBy(category.rules, 'name').map(rule => {
              return <tr key={rule.id}>
                <td style={{ width: 160 }}>
                  <span style={{display: 'inline-block', width: '60px', fontSize: 12}}>
                    { rule.consensusCount > 0 && consensusDisplay(rule) }
                  </span>
                  { rule.commentsCount > 0 && <span className="style-guide-line-stat-bubble">💬{rule.commentsCount}</span> }
                  { rule.votesCount > 0 && <span className="style-guide-line-stat-bubble">🗳️{rule.votesCount}</span> }
                </td>
                <td style={{ width: 300 }}>
                  { !rule.isNotSupported &&
                  <Link to={`/projects/${styleGuide.project.domain}/style-guides/${styleGuide.id}/rules/${rule.id}`}>
                    <h3 style={{display: 'inline'}}>{trimRuleName(rule)}</h3>
                  </Link>
                  }
                  {
                    rule.isNotSupported &&
                    <div>
                      <h3 style={{display: 'inline'}}>{trimRuleName(rule)}</h3>
                      <div style={{ fontSize: 12, color: "#666" }}>Currently Not Supported</div>
                    </div>
                  }
                </td>
                <td>
                  {rule.shortDescription}
                </td>
              </tr>
            }) }
            </tbody>
          </table>
        </div>
      </div>
    }

    const displayCategories = _.compact(categories.map(category => buildCategoryBlock(category)))

    if (displayCategories.length === 0) {
      return <Callout style={{ marginTop: 50, textAlign: 'center' }}>Nothing to show</Callout>
    }
    return <div>{displayCategories}</div>
  }

  description() {
    const styleGuide = this.state.styleGuide
    if (!styleGuide.description || styleGuide.description.length == 0) return null

    return <Callout style={{ width: 600, marginTop: 20 }}>
      {styleGuide.description}
    </Callout>
  }

  stats() {

    const styleGuide = this.state.styleGuide
    return <div style={{marginBottom: 10}}>
      <HTMLTable>
        <tbody>

          { styleGuide.language && <tr>
            <td>Language</td>
            <td>
              <LanguageIcon language={styleGuide.language} style={{height: 30, position: 'absolute', verticalAlign: 'middle' }} />
              <div style={{marginLeft: 40, paddingTop: 6}}>{styleGuide.language}</div>
            </td>
          </tr> }

          { styleGuide.linter && <tr>
            <td>Linter</td>
            <td>{styleGuide.linter}</td>
          </tr> }

          { styleGuide.createdByUser && <tr>
            <td>Creator</td>
            <td><UserIconWithName user={styleGuide.createdByUser} /></td>
          </tr> }

        </tbody>
      </HTMLTable>
    </div>
  }

  details(){
    return <Card>
      <div className="card-title">Details</div>
      { this.stats() }
      { this.canEdit() && this.adminPanel() }
    </Card>
  }

  canEdit(){
    const styleGuide = this.state.styleGuide
    return this.props.currentUserCan({styleGuide})('edit')
  }

  canEditRules(){
    return _.isEmpty(this.state.styleGuide.linter)
  }

  adminPanel(){
    const styleGuide = this.state.styleGuide

    const clickEditSettings = () => this.props.actions.openModal({
        modalName: "StyleGuideSettings",
        modalProps: { styleGuideId: this.state.styleGuide.id }
      })

    const addCategory = () => this.props.actions.openModal({
      modalName: "CreateCategory",
      modalProps: { styleGuideId: this.state.styleGuide.id }
    })

    const addRule = ()  => {
      this.props.actions.openModal({ modalName: "CreateRule", modalProps: { styleGuide } })
    }
    return <Menu>
      <Menu.Item text="Change Settings" onClick={clickEditSettings} icon={IconNames.EDIT} />
      { this.canEditRules() && <Menu.Item text="Add Category"    onClick={addCategory}       icon={IconNames.ADD}  /> }
      { this.canEditRules() && <Menu.Item text="Add Rule"        onClick={addRule}           icon={IconNames.ADD}  /> }
    </Menu>
  }

  controls(){
    const linter = this.state.styleGuide.linter
    return <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '300px 300px 300px', gridGap: 10 }}>
      <Card>{this.filter()}</Card>
      { this.details() }
      { linter == 'rubocop' && this.generateRubocop() }
    </div>
  }

  generateRubocop(){
    const styleGuideId = this.state.styleGuide.id
    const configFile = this.state.styleGuide.configFile
    const asyncState = this.props.asyncState.get('generateConfigFile')

    const hasSomeConsensus = _.some(this.state.styleGuide.rules, rule => rule.consensusCount > 0)

    const clickGenerate = () => {
      this.props.actions.generateConfigFile({styleGuideId})
    }
    const generateButton = () => <Button loading={asyncState.pending} icon="build" onClick={clickGenerate}>Generate</Button>

    const configDetails = () => {

      const clickCopyToClipboard = () => {
        copyToClipboard(configFile.url)
        AppToaster.show({ message: 'Copied', intent: 'success'})
      }
      const openInNewWindow = () => {
        window.open(configFile.url)
      }
      const canGenerateAt = addMinutes(configFile.updatedAt, 2)
      const disabled = isFuture(canGenerateAt)

      if (disabled && !this.state.delayFor) {
        const delayFor = differenceInMilliseconds(new Date(), canGenerateAt)
        this.setState({delayFor})
        // console.log('delayFor');
        // console.dir(delayFor);
        // const self = this
        // const reload = function* () {
        //   self.setState({delayFor: null})
        // }
      }

      return <div>
        <ControlGroup>
          <InputGroup style={{width: '200px', fontSize: '11px', }} value={configFile.url} readOnly />
          <Button
            title="open"
            icon="share"
            onClick={openInNewWindow}
            />
          <Button
            title="Copy link to clipboard"
            icon="clipboard"
            onClick={clickCopyToClipboard}
            />
        </ControlGroup>
        <Button disabled={disabled} loading={asyncState.pending} onClick={clickGenerate} icon="refresh" style={{marginTop: 10}}>Regenerate</Button>
        { !asyncState.pending &&
          <div style={{ marginTop: 5, fontSize: 10, color: '#888', fontStyle: 'italic'}}>
          { !disabled && <div>Last Generation: <TimeAgo date={configFile.updatedAt} /></div> }
          { disabled && <div>Just generated. Can regenerate in <TimeAgo date={canGenerateAt} /></div> }
          </div>
        }
      </div>
    }

    const atLeastOneConsensusMessage = () => {
      return <Callout>
        <p>To generate rubocop.yml need to have at least 1 consensus.</p>
        <p>Start voting with your teammates</p>
      </Callout>
    }

    return <Card>
      <div className="card-title">
        <RuboCopIcon style={{height: 18, marginRight: 6}} />
        .rubocop.yml
        <Tooltip
          content="Includes only those rules and options which had consensus. Link is static"
          position={Position.TOP}>
            <Icon icon="info-sign" iconSize={12} style={{marginLeft: 5, color: '#444'}} />
        </Tooltip>
      </div>

      <Callout style={{marginBottom: 5, fontSize: 12, paddin: 5, display: 'none'}}>
        This file includes only those rules and options which had full consensus of your group
      </Callout>

      { !hasSomeConsensus && atLeastOneConsensusMessage() }
      { hasSomeConsensus && !configFile && generateButton() }
      { hasSomeConsensus && configFile && configDetails() }
    </Card>
  }

  queryOptions(){
    // const isRulesPopulated = this.state.styleGuide && this.state.styleGuide.isRulesPopulated
    // const fetchPolicy = isRulesPopulated ? "cache-and-network" : "network-only"
    return { fetchPolicy: "network-only" }
  }
}

export default compose(
  withRouter,
  withCurrentUser,
  fConnect(({StyleGuides}) => {
    return {
      expandedCategories: StyleGuides.get('expandedCategories'),
      filterValue: StyleGuides.get('filterValue'),
      asyncState: StyleGuides.get('asyncState'),
    }
  },{
    openModal,
    expandCategory,
    collapseCategory,
    expandAll,
    collapseAll,
    setCategoryIds,
    setFilter,
    generateConfigFile,
    checkPopulatingComplete,
  })
)(StyleGuideShow)
