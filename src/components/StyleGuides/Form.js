import React from 'react'

import {
  Dialog,
  Button,
  Intent,
  Classes,
} from '@blueprintjs/core'

import {
  Form as FuksForm,
  Input,
  FormSubmit,
  Errors
} from '~/fuks'

const languages = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Ruby",
    value: "ruby",
    iconSrc: `/images/language-icons/ruby.png`
  },
  {
    label: "JavaScript",
    value: "javascript",
    iconSrc: `/images/language-icons/javascript.png`
  },
]

class Form extends React.Component {

  render(){
    const {
      record,
      onSuccess
    } = this.props

    const submitLabel = record.id ? "Update" : "Create"
    return <div>
      <FuksForm forRecord={record} onSuccess={onSuccess} dontResetFieldsOnSubmit>
        <div className={Classes.DIALOG_BODY}>
          <Errors />
          { !record.id && <Input field="projectId Int" as="hidden" /> }
          <Input field="name String!" label="Name" autoFocus  />
          { !record.id && <Input field="language String!"   label="Programming Language" as="select" collection={languages} /> }
          <Input field="description String" label="Description" as="textarea" />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <FormSubmit label={submitLabel} />
          </div>
        </div>
      </FuksForm>
    </div>
  }

}

export default Form
