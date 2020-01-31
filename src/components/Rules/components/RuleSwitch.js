import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  ButtonGroup
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import VoteButton from './VoteButton'
import UnvoteButton from './UnvoteButton'
import VotesDisplay from './VotesDisplay'
import { withCurrentUser } from '~/contexts'

class RuleSwitch extends React.Component {

  question() {
    const { param, rule } = this.props

    if (rule.linter === "eslint") {
      return "Which result should be produced when this rule is offended?"
    } else if (rule.linter === "rubocop") {
      return "Should this rule be ON or OFF ?"
    } else {
      return param.name
    }
  }

  buildIcon(name) {
    if (name == "false") {
      return IconNames.THUMBS_DOWN
    }

    if (name == "true") {
      return IconNames.THUMBS_UP
    }

    if (name == "bad") {
      return IconNames.THUMBS_DOWN
    }

    if (name == "good") {
      return IconNames.THUMBS_UP
    }

    if (name == "error") {
      return IconNames.ERROR
    }

    if (name == "warn") {
      return IconNames.WARNING_SIGN
    }

    if (name == "off") {
      return IconNames.DISABLE
    }

    return null
  }

  mappingForLabel(name) {
    if (name == "false") {
      return "OFF"
    }

    if (name == "true") {
      return "ON"
    }

    return name
  }

  render() {
    const {
      styleGuide,
      rule,
      param,
      votes,
      currentUser
    } = this.props

    const currentUserVote = _.find(votes, { userId: `${currentUser.id}` })

    return <div className="rule-status-voting">
      <p>{this.question()}</p>
      <ButtonGroup>
        {_.sortBy(param.options, v => v.name == "true" ? 0 : 1).map(option => {
          const votesFor = _.filter(votes, { optionId: option.id })
          const buttonProps = {
            styleGuide,
            ruleId: rule.id,
            optionId: option.id,
            paramId: param.id,
            icon: this.buildIcon(option.value),
            label: this.mappingForLabel(option.value),
          }

          return <div key={option.id} style={{ marginRight: 20 }}>
            {currentUserVote && currentUserVote.optionId == option.id ?
              <UnvoteButton
                {...buttonProps}
                voteId={currentUserVote.id}
              />
              :
              <VoteButton {...buttonProps} />
            }
            <div className="votes-count">
              <VotesDisplay votes={votesFor} vertical hasConsensus={option.hasConsensus} />
            </div>
          </div>
        })
        }
      </ButtonGroup>
    </div>
  }
}

RuleSwitch.propTypes = {
  styleGuide: PropTypes.object.isRequired,
  rule: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  votes: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
}

export default withCurrentUser(RuleSwitch)
