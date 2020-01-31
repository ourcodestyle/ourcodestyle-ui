import React from 'react'

import {actionsConnect} from '~/utils/components'
import {unvote} from '../redux/actions'

import {
  Button,
  Intent
} from '@blueprintjs/core'

const UnvoteButton = (props) => {
  const { voteId, intent, ruleId, paramId, optionId, actions } = props
  const label = typeof(props.label) === 'undefined' ? 'Unvote' : props.label
  const icon = props.icon || "thumbs-up"

  return <Button
            disabled={voteId < 0}
            text={label}
            icon={icon}
            intent={Intent.SUCCESS}
            onClick={() => actions.unvote({ ruleId, paramId, optionId, voteId })}
          />
}

export default actionsConnect({unvote})(UnvoteButton)
