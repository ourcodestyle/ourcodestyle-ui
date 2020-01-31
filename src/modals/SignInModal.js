import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { 
  Dialog, 
  Button, 
  Intent, 
  Classes 
} from '@blueprintjs/core'

import Storage from '~/services/storage'

class SignInModal extends React.Component {

  render(){
    const props = this.props
    const redirectTo = (location) => () => props.history.push(location)

    const onClose = (...args) => {
      props.closeModal()
    }
    const authGitHub = () => {
      Storage.set('returnTo', props.history.location.pathname)
      props.closeModal()
      redirectTo("/auth/github")()
    }

    return (
      <Dialog
        icon="lock"
        isOpen={props.isOpen}
        onClose={onClose}
        title="Please Authorize"
      >
        <div className={Classes.DIALOG_BODY}>
          In order to vote you need to sign in with GitHub so other people can know who you are.
          <div style={{marginTop: 12, textAlign: 'center'}}>
            <img src="/images/github-octocat.png" style={{maxWidth: 150}} />
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                    intent={Intent.PRIMARY}
                    onClick={authGitHub}
                    text="Sign In with GitHub"
                />
            </div>
        </div>
      </Dialog>
    )
  }
}

export default withRouter(SignInModal)