import React from 'react'
import { AppToaster } from '~/components/toaster'
import { connect } from 'react-redux'

import {
  Dialog,
  Classes,
  Intent,
  Button
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
} from '~/fuks'

class ConfirmDeleteModal extends React.Component {

  render(){
    const { isOpen, closeModal, action, dispatch, content } = this.props

    if (!isOpen) return null

    const body = content || <div>Are you sure?</div>
    const clickYes = () => {
      dispatch(action)
      closeModal()
    }

    return (
      <Dialog
        icon="warning-sign"
        isOpen={isOpen}
        onClose={closeModal}
        title="Confirmation is needed"
      >
        <div className={Classes.DIALOG_BODY}>
          {body}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Yes" onClick={clickYes} />
            <Button text="Cancel" onClick={closeModal} />
          </div>
        </div>
      </Dialog>
    )
  }
}

export default connect()(ConfirmDeleteModal)