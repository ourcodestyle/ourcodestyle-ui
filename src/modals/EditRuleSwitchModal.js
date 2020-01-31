import React from 'react'
import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  Classes,
  Intent,
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
} from '~/fuks'

class EditRuleSwitchModal extends React.Component {

  render(){
    const { isOpen, closeModal, ruleOption, language } = this.props
    if (!isOpen) return null

    const onSuccess = () => {
      closeModal()
      AppToaster.show({ message: 'Updated', intent: Intent.SUCCESS})
    }

    return (
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit Rule Switch"
      >
        <div className={Classes.DIALOG_BODY}>

        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>

          </div>
        </div>
      </Dialog>
    )
  }
}

export default EditRuleSwitchModal
