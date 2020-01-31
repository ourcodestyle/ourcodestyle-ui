import React from 'react'
import PropTypes from 'prop-types'
import gql from "graphql-tag"
import {
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Intent,
  Divider,
  Icon
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import Markdown from '~/pure/Markdown'

import _ from 'lodash'

import QueryComponent from '~/fuks/QueryComponent'

import RuleSwitch from './components/RuleSwitch'
import Param from './components/Param'
import Path from './components/Path'
import ParamsSelector from './components/ParamsSelector'

import {withCurrentUser} from '~/contexts'

import { withRouter } from 'react-router'
import { compose } from 'redux'

import RULE_GQL from './rule.gql'

import {fConnect} from '~/utils/components'
import {openModal,showUser} from '~/redux/globalActions'
import {
  voted,
  unvoted,
  deleteRule,
  setAudience
} from './redux/actions'

import SectionCard from '~/components/ui/SectionCard'

import { withApollo } from 'react-apollo'

import {
  VOTE,
  USER
} from '~/gql/fragments'
import UserAvatar from '~/pure/UserAvatar'

class RuleShow extends QueryComponent {

  query(){
    return RULE_GQL
  }

  queryVariables(){
    return { id: this.props.match.params.ruleId }
  }

  queryLoaded({rule}) {
    this.setState({rule})
  }

  componentDidMount() {
    super.componentDidMount()
    if (this.props.currentUser && !this.props.currentUser.isGuest) {
      this.startSubscriptions()
    }
  }

  componentWillUnmount() {
    this.endSubscriptions()
  }

  startSubscriptions(){
    this.startAppearSubscription()
    this.startVotedSubscription()
  }

  endSubscriptions(){
    this.endAppearSubscription()
    this.endVotedSubscription()
  }

  startVotedSubscription() {
    const { currentUser } = this.props
    if (this.subscriptionVoted) return

    const query = gql`
      subscription voted ($ruleId: ID!) {
        voted(ruleId: $ruleId) {
          ... VOTE
        }
      }
      ${VOTE}
      ${USER}
    `

    const next = ({data}) => {
      // already updated it, no need for 3rd rewrite
      if (data.voted && data.voted.userId != currentUser.id) {
        // console.debug('subscription got vote')
        this.props.actions.voted({vote: data.voted})
      } else {
        // console.debug("skiping vote in subscription as it comes for currentUser")
      }
    }
    const error = (data) => {
      console.error('ws error voted')
      console.error(data)
    }

    const { match } = this.props
    const variables = { ruleId: match.params.ruleId }
    this.subscriptionVoted = this.props.client.subscribe({ query, variables }).subscribe({ next, error })
  }

  endVotedSubscription() {
    if (this.subscriptionVoted) {
      this.subscriptionVoted.unsubscribe();
      delete this.subscriptionVoted;
    }
  }

  startAppearSubscription() {
    const { match, actions } = this.props
    const ruleId = match.params.ruleId
    if (this.subscriptionAppeared) return

    const query = gql`
      subscription ($ruleId: ID!) {
        appearedOnRule(ruleId: $ruleId) {
          ruleId
          appearedAt
          user {
            ... USER
          }
        }
      }
      ${USER}
    `

    const next = ({data}) => {
      const presenceList = data.appearedOnRule
      actions.setAudience({ruleId, presenceList})
    }
    const error = (data) => {
      console.error('ws error appeared')
      console.error(data)
    }

    const variables = { ruleId }
    this.subscriptionAppeared = this.props.client.subscribe({ query, variables }).subscribe({ next, error })
  }

  endAppearSubscription() {
    if (this.subscriptionAppeared) {
      this.subscriptionAppeared.unsubscribe();
      delete this.subscriptionAppeared;
    }
  }

  detailsAsTab(){
    const description = this.state.rule.description || ""
    return _.some([
      description.length > 400,
      description.indexOf("```") !== -1,
      description.indexOf("##") !== -1,
    ])
  }

  displayParams(){
    return _.sortBy(_.reject(this.state.rule.params, 'isSwitch'), 'id')
  }

  selectedParam(){
    const { paramId } = this.props.match.params
    if (paramId === 'details') return { id: 'details' }

    const displayParams = this.displayParams()
    if (displayParams.length === 0) return { id: 'details' }

    return _.find(displayParams, { id: paramId || displayParams[0].id })
  }

  nameAndDescription() {
    const { rule } = this.state
    const { currentUser, match, history, viewMode, actions } = this.props
    let { styleGuideId, ruleId, paramId } = match.params

    const optionSwitch = _.find(rule.params, 'isSwitch')
    const switchVotes = !optionSwitch ? [] : _.filter(rule.votes, { paramId: optionSwitch.id })

    const displayParams = this.displayParams()

    const openRuleDetails = () => {
      console.log('openRuleDetails')
      const location = `/organizations/${rule.styleGuide.organization.domain}/style-guides/${styleGuideId}/rules/${ruleId}/details`
      history.push(location)
    }

    const buildTabTitle = (option) => {
      return <div style={{ width: '100%', textAlign: 'left' }}>
        <div style={{float: 'right', marginLeft: 10}}> &rarr; </div>
        {option.name}
      </div>
    }

    let ruleDetailsTab = null
    let ruleDetailsText = null
    if (this.detailsAsTab()) {
      ruleDetailsTab = <div>
        <Tabs large vertical selectedTabId={paramId || null} onChange={() => openRuleDetails()}>
          <Tab id="details" title="Rule Details" />
        </Tabs>
      </div>
    } else {
      ruleDetailsText = <div>{this.state.rule.description}</div>
    }

    const showParamsSelector = ruleDetailsTab || displayParams.length > 1

    const paramSelectorKey = _.map(rule.params, 'name').join('.')
    return <div>
      <div className="rule-name-header">
        <h1 style={{ marginTop: 0, fontSize: 24 }}>
          {rule.name}
        </h1>
        <div className="rule-options-tabs">
          { ruleDetailsTab }
          { ruleDetailsText }
          { showParamsSelector && <ParamsSelector rule={rule} params={rule.params} key={paramSelectorKey} paramId={paramId} /> }
        </div>
      </div>
      { optionSwitch &&
      <SectionCard title="Good or Harmful Rule">
        <RuleSwitch
          styleGuide={this.state.rule.styleGuide}
          rule={rule}
          param={optionSwitch}
          votes={switchVotes}
          currentUser={currentUser}
          />
      </SectionCard>
      }

      <SectionCard title="Consensus Rules" icon={IconNames.ENDORSED}>
        { this.consensusConfig() }
      </SectionCard>
    </div>
  }

  consensusConfig(){
    const consensusConfig = this.state.rule.styleGuide.consensusConfig
    return <table>
      <tbody>
        <tr>
          <td>Minimal votes to win</td>
          <td>{consensusConfig.minWinVotes}</td>
        </tr>
        <tr>
          <td>Minimal win margin</td>
          <td>{consensusConfig.minWinMargin}</td>
        </tr>
      </tbody>
    </table>
  }

  usage(rule){
    return <div>
      Add this to <b>rubocop.yml</b>

      <p style={{marginTop: 10, marginBottom: 0}}>To enable this rule:</p>
      <div style={{ textAlign: 'left', background: "#eee", paddingLeft: 5, height: '100%', marginBottom: 5 }}>
        <pre>
        {rule.name}:{"\n"}
          {"  "}Enabled: true
        </pre>
      </div>

      <p style={{marginTop: 10, marginBottom: 0}}>To disable this rule:</p>
      <div style={{ textAlign: 'left', background: "#eee", paddingLeft: 5, height: '100%', marginBottom: 5 }}>
        <pre>
        {rule.name}:{"\n"}
          {"  "}Enabled: false
        </pre>
      </div>
    </div>
  }

  options(){
    const param = this.selectedParam()
    const {rule} = this.state

    return <Param
            rule={rule}
            param={param}
            votes={param.votes}
            canEdit={this.canEdit()}
            canSuggest={this.canSuggest()}
            openModal={this.props.actions.openModal}
            styleGuide={this.state.rule.styleGuide}
            />
  }

  manage() {
    const { actions } = this.props
    const { rule } = this.state
    const clickDelete   = () => actions.openModal("ConfirmDelete", { action: deleteRule({ id: rule.id })})
    const clickEditRule = () => actions.openModal("EditRule", {rule})
    const clickAddParam = () => actions.openModal("CreateParam", {rule})

    return <SectionCard title="Manage Rule">
      <Menu>
        <MenuItem icon={IconNames.EDIT} text="Edit Rule" onClick={clickEditRule} />
        <MenuItem icon={IconNames.ADD} text="Add Param" onClick={clickAddParam} />
        <Divider />
        <MenuItem icon={IconNames.DELETE} text="Delete" intent={Intent.DANGER} onClick={clickDelete} />
      </Menu>
    </SectionCard>
  }

  ruleDetails(){
    const { rule } = this.state
    return <Markdown source={rule.description} />
  }

  canEdit(){
    const styleGuide = this.state.rule.styleGuide
    if (!_.isEmpty(styleGuide.linter)){
      return false
    }
    return this.props.currentUserCan({styleGuide})("edit")
  }

  canSuggest(){
    const styleGuide = this.state.rule.styleGuide
    return this.props.currentUserCan({styleGuide})("suggest")
  }

  content() {
    const { rule } = this.state
    const selectedParam = this.selectedParam()

    return <div>
      <div style={{ marginTop: 10 }}>
        <Path
          styleGuide={rule.styleGuide}
          rule={rule}
        />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', gridGap: 20, marginTop: 20 }}>
        <div>
          { this.nameAndDescription() }
          { this.canEdit() && this.manage() }
        </div>
        <div>
          { selectedParam && selectedParam.id === 'details' && this.ruleDetails() }
          { selectedParam && selectedParam.id !== 'details' && this.options() }
        </div>
      </div>

      {/* { this.presenceList() } */}
    </div>
  }

  presenceList(){
    const {presenceList, currentUser} = this.props
    if (!presenceList || presenceList.length === 0) {
      return null
    }
    const users = _.reject(_.map(presenceList, 'user'), u => u.id === currentUser.id)

    if (users.length === 0) {
      return null
    }

    return <div className="rule-online-container">
      <div style={{fontSize: 12, marginBottom: 5, marginTop: -5}}>
        <Icon icon="dot" color="green" />
        Current Viewers
      </div>
      <div>
        {users.map(user => <UserAvatar key={user.id} user={user} style={{display: 'inline-block', marginRight: 5}} />)}
      </div>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => {
  const ruleId = ownProps.match.params.ruleId
  return { presenceList: state.Rules.getIn([ruleId, 'presenceList']) }
}
export default compose(
  fConnect(mapStateToProps,
  {
    openModal,
    showUser,
    voted,
    unvoted,
    setAudience,
  }),
  withRouter,
  withCurrentUser,
  withApollo,
)(RuleShow)
