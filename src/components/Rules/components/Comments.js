import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import { withCurrentUser } from '~/contexts'
import { compose } from 'redux'
import AddCommentForm from './AddCommentForm'
import Comment from './Comment'

import {openModal, like, unlike} from '~/redux/globalActions'
import {actionsConnect} from '~/utils/components'

class Comments extends React.Component {

  render(){
    const { currentUser, currentUserCanAction, intent, rule, param, option, comments, actions } = this.props
    // const placeholder = intent == 'negative' ? "Write why you don't like this option" : "Write why this option is better"
    const placeholder = 'Your comment ...'
    return <div className="comments-container">
      { !currentUser.id && comments.length == 0 && <i style={{color: '#eee'}}>no comments yet</i> }
      { comments.map(({id, text, user, likesCount, myLikes}) =>
        <Comment
          key={id}
          currentUserCanAction={currentUserCanAction}
          id={id}
          text={text}
          user={user}
          currentUser={currentUser}
          actions={actions}
          likesCount={likesCount}
          myLikes={myLikes}
          />)
      }
      { currentUser.id && <AddCommentForm {...{rule, param, option, intent, placeholder}} /> }
    </div>
  }
}

export default compose(
  actionsConnect({openModal, like, unlike}),
  withCurrentUser
)(Comments)
