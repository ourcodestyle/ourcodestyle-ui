import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Classes,
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
  Errors
} from '~/fuks'

const ParamForm = (props) => {
  const {
    param,
    onSuccess
  } = props

  const optionTypes = [
    'Boolean',
    'Hash',
    'Integer',
    'List',
    'Pair',
    'Regex',
    'String',
  ]

  const [optionsType, setOptionsType] = useState(param.optionsType)

  const onChange = (fieldName, value) => {
    if (fieldName === 'optionsType') {
      setOptionsType(value)
    }
  }

  return (
    <Form forRecord={param} onSuccess={onSuccess} onChange={onChange}>
      <div className={Classes.DIALOG_BODY}>
        <Errors />

        { !param.id && <Input field="ruleId ID!" as="hidden" /> }
        <Input field="name String!" autoFocus />
        <Input field="description String" as="textarea" optionalLabel="(markdown)" />
        <Input field="optionsType String!" label="Type" as="select" collection={optionTypes} disabled={!!param.id} />
        <If condition={optionsType !== 'Boolean'}>
          <Input field="allowAddOptions Boolean" label="Members can add Options" as="switch" />
          <Input field="allowMultipleValues Boolean" label="Allow voting for several Options" as="switch" />
        </If>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <FormSubmit label={param.id ? "Save" : "Create"} />
        </div>
      </div>
    </Form>
  )
}

ParamForm.propTypes = {
  param: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
}

export default ParamForm
