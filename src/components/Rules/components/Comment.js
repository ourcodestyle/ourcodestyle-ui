import React from 'react'
import gql from "graphql-tag"
import pluralize from 'pluralize'
import UserAvatar from '~/pure/UserAvatar'
import {
  Button,
  Icon,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import {deleteComment} from '~/components/Rules/redux/actions'

class Comment extends React.Component {

  deleteButton(){
    const props = this.props
    const onClickDelete = () => props.actions.openModal({
      modalName: "ConfirmDelete",
      modalProps: {
        action: deleteComment({ id: props.id })
      }
    })
    return <Icon icon="trash" onClick={onClickDelete} style={{cursor: 'pointer'}} />
  }

  likeButton() {
    const props = this.props
    const liked = props.myLikes.length > 0
    if (liked){
      console.log(props.myLikes)
    }
    const intent = liked ? "success" : "none"
    const clickAction =  liked ? props.actions.unlike : props.actions.like
    const onClick = () => clickAction({
      likeableType: "Comment",
      likeableId: props.id,
      likesCount: props.likesCount,
    })
    return <div>
      <Icon icon={IconNames.THUMBS_UP} intent={intent} onClick={onClick} style={{cursor: 'pointer'}} />
    </div>
  }

  render(){
    const props = this.props
    const { currentUser, user, currentUserCanAction } = this.props
    return <div className="comment-container" style={{ display: 'grid', width: '100%', gridTemplateColumns: '40px 1fr 90px'}}>
      { user && <UserAvatar user={user} /> }
      <div>{props.text}</div>
      <div style={{display: 'grid', gridTemplateColumns: '20px 70px'}}>
        { user && currentUserCanAction("deleteComment", {createdByUserId: user.id}) && this.deleteButton() || <div></div> }
        <div style={{display: 'grid', gridTemplateColumns: '20px 1fr'}}>
          <div style={{textAlign: 'right' }}>{ this.likeButton() }</div>
          <div style={{paddingLeft: 5}}>
            { props.likesCount > 0 && <div style={{width: '100%'}}>{pluralize("like", props.likesCount, true)}</div>}
          </div>
        </div>
      </div>
    </div>
  }
}

export default Comment
