import React from 'react'
import {withCurrentUser} from '~/contexts'
import {actionsConnect} from '~/utils/components'
import {compose} from 'redux'
import {openModal} from '~/redux/globalActions'
import {vote} from '../redux/actions'

import {
  Button,
} from '@blueprintjs/core'

const VoteButton = (props) => {
  const { styleGuide, ruleId, paramId, optionId, currentUser, actions, allowMultipleValues } = props

  const intent = props.intent || null // because undefined is threatted as not passed by graphql storage so it raises warning
  const label = typeof(props.label) === 'undefined' ? 'Vote' : props.label
  const icon = props.icon || "thumbs-up"

  const whoCanVote = styleGuide.whoCanVote
  const isMember = (currentUser && !currentUser.isGuest) && _.includes(_.map(currentUser.memberships, 'organization.id'), styleGuide.organization.id)

  let onClick
  if (currentUser.isGuest) {
    onClick = () => actions.openModal({ modalName: "SignIn" })
  } else {
    if (isMember || whoCanVote === "anyone") {
      onClick = () => actions.vote({ruleId, paramId, optionId, intent, allowMultipleValues})
    } else {
      const modalProps = {
        organizationId: styleGuide.organization.id
      }
      onClick = () => actions.openModal({ modalName: "RequestAccessToOrganization", modalProps })
    }
  }


  return <Button
            text={label}
            icon={icon}
            onClick={onClick}
          />
}

export default compose(
  withCurrentUser,
  actionsConnect({vote, openModal})
)(VoteButton)
