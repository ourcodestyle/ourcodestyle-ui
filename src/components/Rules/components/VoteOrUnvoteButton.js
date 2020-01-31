import React from 'react'

import VoteButton from './VoteButton'
import UnvoteButton from './UnvoteButton'
import _ from 'lodash'

const VoteOrUnvoteButton = (props) => {
  const commonProps = _.pick(props, ['ruleId', 'styleGuide', 'paramId', 'optionId', 'allowMultipleValues', 'label', 'intent', 'icon'])
  const currentUserVoteId = props.currentUserVoteId

  if (currentUserVoteId) {
    return <UnvoteButton voteId={currentUserVoteId} {...commonProps} />
  } else {
    return <VoteButton {...commonProps} />
  }
}

export default VoteOrUnvoteButton
