import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'redux'
import {
  Button,
} from '@blueprintjs/core'
import _ from 'lodash'
import {withCurrentUser} from '~/contexts'
import VoteButton from './VoteButton'
import UnvoteButton from './UnvoteButton'
import VotesDisplay from './VotesDisplay'
import VotingUpDown from './VotingUpDown'

import Comments from './Comments'

import { IconNames } from '@blueprintjs/icons'
import {
  Icon,
  Intent,
} from '@blueprintjs/core'

import UserAvatar from '~/pure/UserAvatar'
import Markdown from '~/pure/Markdown'
import Code from '~/pure/Code'

import {
  parsePair,
  parseList,
} from '~/utils/optionUtils'

import {
  deleteOption
} from '~/components/Rules/redux/actions'


class Option extends React.Component {

  render() {
    const { rule, param, option, styleGuide } = this.props

    const showSuggester = param.allowAddOptions

    const comments = _.filter(option.comments, { isDeleted: false })

    const buildOptionName = (option) => {
      if (_.includes(['Pair', 'List', 'Hash'], param.optionsType)){
        return null
      }
      return option.value
    }

    const currentUserCanAction = this.props.currentUserCan({styleGuide})

    const optionName = buildOptionName(option)
    const optionNameBlock = optionName && <span style={{fontWeight: 'bold', marginRight: 10}}>
            { buildOptionName(option) }
          </span>

    return <div className="rule-option-value" style={{padding: 0}}>
      <div style={{ background: "#eee", padding: 10, height: 40 }}>
        <div style={{float: 'right'}}>
          {this.buildConsensus()}
          <div style={{ height: 20, display: 'inline-block', marginTop: -4, marginRight: -4 }}>
            {this.buildVotes()}
          </div>
        </div>
        <div style={{ margin: 0, padding: 0, height: 26, overflow: 'hidden' }}>
          { optionNameBlock }
          { showSuggester && this.buildSuggester() }
          <div style={{display: 'inline-block'}}>
            { this.manage() }
          </div>
        </div>
      </div>

      { _.includes(['Pair', 'List', 'Hash'], param.optionsType) && this.displayValueSpecial() }

      { option.description && <div style={{padding: 5}}>
        <Markdown source={option.description} />
      </div> }

      <div style={{ padding: 5 }}>
        <Comments
          currentUserCanAction={currentUserCanAction}
          rule={rule}
          param={param}
          option={option}
          comments={comments}
        />
      </div>
    </div>
  }

  displayValueSpecial() {
    const { param, option } = this.props
    let content = null
    if (param.optionsType === 'Pair') {
      const [key, value] = parsePair(option)
      content = <div style={{ fontSize: 20, padding: 10 }}>
        {key} &rarr; {value}
      </div>
    } else if (param.optionsType === 'List') {
      const list = parseList(option)
      content = <ul>
        {list.map(value => <li key={value}>{value}</li>)}
      </ul>
    } else if (param.optionsType === 'Hash') {
      <Code value={option.value} language="yaml" readOnly={true} />
    }

    return content
  }

  buildSuggester() {
    const { option } = this.props
    const creatorAvatar = option.createdByUser && <UserAvatar user={option.createdByUser} />

    const defaultText = <span style={{color: '#555', fontSize: 10}}>
      (default)
    </span>

    const content = option.isDefault ? defaultText : creatorAvatar
    if (!content) return null

    return <div style={{ verticalAlign: 'top', width: 50, display: 'inline-block' }}>
      {content}
    </div>
  }

  manage() {
    const { canEdit, param, option, styleGuide, openModal } = this.props
    if (!canEdit) return null
    if (option.isDefault) return null

    const clickEdit = () => {
      openModal({
        modalName: "EditOption",
        modalProps: {
          param,
          option,
          language: styleGuide.language
        }
      })
    }

    const clickDelete = () => {
      openModal({
        modalName: "ConfirmDelete",
        modalProps: {
          action: deleteOption({ id: option.id })
        }
      })
    }

    return [
      <Button key="edit"   small text="Edit"   icon="edit"  style={{ marginLeft: 10 }} onClick={clickEdit} />,
      <Button key="delete" small text="Delete" icon="trash" style={{ marginLeft: 10 }} onClick={clickDelete} />
    ]
  }

  buildVotes() {
    const {
      rule,
      param,
      option,
      votes,
      styleGuide,
      currentUser
    } = this.props
    const currentUserVote = _.find(votes, { userId: currentUser.id })

    if (param.allowMultipleValues) {
        return <VotingUpDown
          rule={rule}
          param={param}
          option={option}
          votes={votes}
          currentUser={currentUser}
          styleGuide={styleGuide}
        />
    } else {
        return <div>
        <VotesDisplay votes={votes} />
        { currentUserVote ?
          <UnvoteButton ruleId={rule.id} paramId={param.id} optionId={option.id} voteId={currentUserVote.id} styleGuide={styleGuide} />
          :
          <VoteButton ruleId={rule.id} paramId={param.id} optionId={option.id} styleGuide={styleGuide} />
        }
      </div>
    }
  }

  buildConsensus() {
    const { option } = this.props
    if (!option.hasConsensus) return null

    return <Icon title="Conensus Solution" icon={IconNames.ENDORSED} intent={Intent.SUCCESS} />
  }
}


export default compose(withCurrentUser)(Option)
