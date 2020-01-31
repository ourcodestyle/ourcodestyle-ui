import React from 'react'

import {
  Dialog,
  Classes,
} from '@blueprintjs/core'

import {
  Form,
  Errors,
  Input,
  FormSubmit
} from '~/fuks'

class EditRuleModal extends React.Component {

  render(){
    const { isOpen, closeModal, rule } = this.props
    if (!isOpen) return null

    const categories = rule.styleGuide.categories.map(c => ({ label: c.name, value: c.id }))

    return <Dialog icon="edit" isOpen={isOpen} onClose={closeModal} title="Edit Rule">
            <Form forRecord={rule} onSuccess={closeModal}>
              <div className={Classes.DIALOG_BODY}>
                <Errors />
                <Input field="categoryId ID" label="Category" as="select" collection={categories} includeBlank />
                <Input field="name String!" autoFocus />
                <Input field="shortDescription String" label="Short Description" />
                <Input field="description String" as="textarea" label="Rule Details" optionalLabel="(optional, markdown supported)" inputProps={{rows: 7}} />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <FormSubmit label="Save" />
                </div>
              </div>
            </Form>
          </Dialog>
  }

}

export default EditRuleModal
