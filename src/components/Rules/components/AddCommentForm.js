import React from 'react'
import PropTypes from 'prop-types'

import {
  Form,
  Input,
  FormSubmit
} from '~/fuks'

import { Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { USER } from '~/gql/fragments'

class AddCommentForm extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      commentsOpen: false
    }
  }

  render(){
    const { option, intent, placeholder } = this.props

    const newComment = {
      __typename: "Comment",
      commentableType: "Option",
      commentableId: option.id,
      intent
    }

    const extraQuery = `
      user {
        ... USER
      }
      commentable {
        ... on Option {
          id
          comments {
            id
            text
            intent
            isDeleted
            likesCount
            myLikes: likes(userId: "me") {
              id
            }
            user {
              ... USER
            }
          }
        }
      }
    `
    const extraQueryFragments = [ USER ]
    const submitStyle = {
      position: 'absolute',
      float: 'right',
      marginLeft: 720,
      marginTop: 10,
    }

    const inputProps = {
      style: {
        width: '100%',
        border: 0,
        paddingRight: 140
      }
    }

    const openComments = () => this.setState({ commentsOpen: !this.state.commentsOpen })
    const commentButton = <Button icon={IconNames.COMMENT} text="Comment" minimal small onClick={openComments} />

    if (!this.state.commentsOpen) {
      return commentButton
    }

    return  <div>
        {commentButton}
        <Form forRecord={newComment} extraQuery={extraQuery} extraQueryFragments={extraQueryFragments}>
          <Input field="intent String" as="hidden" />
          <Input field="commentableType String!" as="hidden" />
          <Input field="commentableId ID!" as="hidden" />
          <div>
            <FormSubmit label="Add Comment" minimal={true} style={submitStyle} />
            <Input autoFocus inputProps={inputProps} field="text String!" as="textarea" placeholder={placeholder} label={null} />
          </div>
        </Form>
    </div>
  }
}

AddCommentForm.propTypes = {
  option: PropTypes.object.isRequired,
  intent: PropTypes.string,
  placeholder: PropTypes.string,
}
export default AddCommentForm
