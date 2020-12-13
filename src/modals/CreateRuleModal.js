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

import withRedirect from '~/fuks/withRedirect'

import linters from '~/lists/linters'
import _ from 'lodash'

class EditRuleModal extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    const { isOpen, closeModal, styleGuide, redirectTo } = this.props
    if (!isOpen) return null

    const lintersForLanguage = _.filter(linters, { language: styleGuide.language })
    const linter = styleGuide.linter || "none"

    const rule = {
      __typename: "Rule",
      styleGuideId: styleGuide.id,
      linter
    }

    const onSuccess = (data) => {
      this.props.history.push(`/projects/shiphawk/style-guides/${data.styleGuideId}/rules/${data.id}`)
      closeModal()
    }

    const categories = styleGuide.categories.map(c => ({ label: c.name, value: c.id }))

    return <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="Create Rule">
            <Form forRecord={rule} onSuccess={onSuccess.bind(this)}>
              <div className={Classes.DIALOG_BODY}>
                <Errors />
                <Input field="styleGuideId ID" as="hidden" />
                <Input field="categoryId ID" label="Category" as="select" collection={categories} includeBlank />
                <Input field="name String!" label="Name" autoFocus />
                <Input field="shortDescription String" label="Short Description" />
                <Input field="description String" label="Rule Details" as="textarea" inputProps={{rows: 7}} />
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

export default withRouter(EditRuleModal)
