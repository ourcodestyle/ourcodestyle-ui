import React from 'react'

import { withRouter } from 'react-router-dom'
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


import _ from 'lodash'

class CreateCategoryModal extends React.Component {

  constructor(props){
    super(props)
  }

  render(){
    const { isOpen, closeModal, styleGuideId } = this.props
    if (!isOpen) return null

    const onSuccess = (data) => {
      closeModal()
    }

    const category = {
      __typename: "Category",
      styleGuideId,
    }

    return <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="Create Category">
            <Form forRecord={category} onSuccess={onSuccess.bind(this)}>
              <div className={Classes.DIALOG_BODY}>
                <Errors />
                <Input field="styleGuideId ID" as="hidden" />
                <Input field="name String!" label="Name" autoFocus />
                <Input field="description String" label="Description" as="textarea" inputProps={{rows: 7}} />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <FormSubmit label="Create" />
                </div>
              </div>
            </Form>
          </Dialog>
  }

}

export default withRouter(CreateCategoryModal)