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

import languages from "~/lists/languages"
import linters from '~/lists/linters'
import _ from 'lodash'

class EditRuleModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { isOpen, closeModal, styleGuide, redirectTo } = this.props
    if (!isOpen) return null

    const lintersForLanguage = _.filter(linters, { language: styleGuide.language })
    // const linter = styleGuide.linter || "none"

    const rule = {
      __typename: "Rule",
      optionsCount: 2,
      language: styleGuide.language,
      styleGuideId: styleGuide.id,
    }

    const onSuccess = (data) => {
      this.props.history.push(`/projects/shiphawk/style-guides/${data.styleGuideId}/rules/${data.id}`)
      closeModal()
    }

    const categories = styleGuide.categories.map(c => ({ label: c.name, value: c.id }))
    const optionsCountOptions = [
      { value: 0, label: 'No Options' },
      { value: 1, label: '1 Option' },
      { value: 2, label: '2 Options' },
      { value: 3, label: '3 Options' },
      { value: 4, label: '4 Options' },
      { value: 5, label: '5 Options' },
    ]

    return <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="Create Rule">
      <Form forRecord={rule} onSuccess={onSuccess.bind(this)}>
        <div className={Classes.DIALOG_BODY}>
          <Errors />
          <Input field="styleGuideId ID" as="hidden" />
          {categories.length > 0 && <Input field="categoryId ID" label="Category" as="select" collection={categories} includeBlank />}
          <Input field="name String!" label="Name" autoFocus />
          <Input field="description String" label="Description" as="textarea" inputProps={{ rows: 7 }} />
          <Input field="shortDescription String" label="Short Description" />
          <Input field="optionsCount Int" label="Options Number (can be changed later)" notReturnable as="select" collection={optionsCountOptions} />
          <Input
            field="language String"
            label="Programming Language"
            as="select"
            collection={_.sortBy(languages, "label")}
            includeBlank={true}
          />
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
