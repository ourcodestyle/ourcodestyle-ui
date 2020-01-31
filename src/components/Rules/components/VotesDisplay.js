import React from 'react'
import pluralize from 'pluralize'
import UserIcon from '~/pure/UserIcon'
import UserIconWithName from '~/pure/UserIconWithName'
import { Popover, Position } from '@blueprintjs/core'
import {
  Icon,
  Intent,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

const VotesDisplay = ({votes, vertical, withIntent, hasConsensus}) => {
  const MAX_USER_ICONS = 3
  let iconsList

  // there can be votes like/dislike
  // in this case we would make a sum of them
  let votesCount
  if (withIntent) {
    const positiveCount = _.filter(votes, {intent: 'positive'}).length
    const negativeCount = _.filter(votes, {intent: 'negative'}).length
    const votesSum = positiveCount - negativeCount

    if (votesSum === 0) {
      votesCount = votesSum
    } else {
      votesCount = votesSum > 0 ? <span className="positive-count">+{votesSum}</span> : <span className="negative-count">{votesSum}</span>
    }
  } else {
    votesCount = pluralize("Vote", votes.length, true)
  }

  if (vertical) {
    const consensusIcon = <div style={{margin: 5}}>
      <Icon title="Conensus Solution" icon={IconNames.ENDORSED} intent={Intent.SUCCESS} />
    </div>
    // const userIconContainerClass = votes.length < 2 ? null : `user-icons-container-${votes.length}` // 2 or 3
    iconsList = (
      <div style={{ maxWidth: 160, textAlign: 'center', width: '100%', display: 'inline-block' }} className="votes-display">
        <div>
          { hasConsensus && consensusIcon }
          <div style={{ marginBottom: 10 }}>{ votesCount }</div>
          <div className="user-icons-container-vertical">
            { votes.slice(0, MAX_USER_ICONS).map(vote => <UserIcon key={vote.user.id} href={vote.user.pictureUrl} /> ) }
          </div>
        </div>
      </div>
    )
  } else {
      iconsList = (
        <div style={{ maxWidth: 160, marginRight: 10, display: 'inline-block' }} className="votes-display">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <span style={{textAlign: 'right'}}>{ votesCount }</span>
            <span className="user-icons-container">
              { votes.slice(0, MAX_USER_ICONS).map(vote => <UserIcon key={vote.user.id} href={vote.user.pictureUrl} /> ) }
            </span>
          </div>
        </div>
      )
  }


  if (votes.length == 0){
    return iconsList
  }

  let iconsHoverList

  if (withIntent) {
    iconsHoverList = <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '200px 200px' }}>
      <div>
        <p><Icon icon={IconNames.THUMBS_UP} /></p>
        {_.filter(votes, {intent: 'positive'}).map(vote => <UserIconWithName key={vote.user.id} user={vote.user} /> )}
      </div>
      <div>
        <p><Icon icon={IconNames.THUMBS_DOWN} /></p>
        {_.filter(votes, {intent: 'negative'}).map(vote => <UserIconWithName key={vote.user.id} user={vote.user} /> )}
      </div>
    </div>
  } else {
    iconsHoverList = <div style={{ padding: 10 }}>
      <h4>Voted:</h4>
      { votes.map(vote => {
        return <div key={vote.user.id} style={{display: 'grid', gridTemplateColumns: '32px 1fr'}}>
          <UserIcon key={vote.user.id} href={vote.user.pictureUrl} />
          <div style={{ lineHeight: "32px", marginLeft: 5 }}>{ vote.user.name }</div>
        </div>
      }) }
    </div>
  }

  return <Popover
    content={iconsHoverList}
    target={iconsList}
    interactionKind="hover"
    position={Position.BOTTOM}
  />
}

export default VotesDisplay