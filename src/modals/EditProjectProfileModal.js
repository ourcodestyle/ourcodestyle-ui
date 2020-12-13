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

class EditProjectProfileModal extends React.Component {

  render(){
    const { isOpen, closeModal, project } = this.props
    if (!isOpen) return null

    const onSuccess = () => {
      closeModal()
      AppToaster.show({ message: 'Saved', intent: Intent.SUCCESS})
    }

    return (
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit Project Profile"
      >
        <Form forRecord={project} onSuccess={onSuccess}>
          <div className={Classes.DIALOG_BODY}>
            <Input field="name String!" />
            <Input field="domain String!" />
            <Input field="website String" />
            <Input field="description String" as="textarea" />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <FormSubmit label="Save" />
            </div>
          </div>
        </Form>
      </Dialog>
    )
  }
}

export default EditProjectProfileModal
