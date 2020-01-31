import React from 'react'
import _ from 'lodash'

import VoteOrUnvoteButton from './VoteOrUnvoteButton'
import VotesDisplay from './VotesDisplay'

class VotingUpDown extends React.Component {

  render() {
    const { styleGuide, rule, param, option, votes, currentUser } = this.props

    const currentUserVote = _.find(votes, { userId: currentUser.id }) || {}

    const voteButtonProps = {
      ruleId: rule.id,
      paramId: param.id,
      optionId: option.id,
      allowMultipleValues: true,
    }

    const positiveCount = _.filter(votes, { intent: 'positive' }).length
    const negativeCount = _.filter(votes, { intent: 'negative' }).length

    return <div>
      <VotesDisplay votes={votes} withIntent />
      <div style={{ display: 'inline-block', marginRight: 6 }}>
        <VoteOrUnvoteButton
          {...voteButtonProps}
          label={positiveCount}
          currentUserVoteId={currentUserVote.intent === 'positive' && currentUserVote.id}
          intent='positive'
          icon='thumbs-up'
          styleGuide={styleGuide}
        />
      </div>
      <VoteOrUnvoteButton
        {...voteButtonProps}
        label={negativeCount}
        currentUserVoteId={currentUserVote.intent === 'negative' && currentUserVote.id}
        intent='negative'
        icon='thumbs-down'
        styleGuide={styleGuide}
      />
    </div>
  }

}

export default VotingUpDown
