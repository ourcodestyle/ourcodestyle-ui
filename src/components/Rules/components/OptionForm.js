import React from 'react'
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

import {
  PARAM,
  OPTION,
  USER,
} from '~/gql/fragments'

const OptionForm = (props) => {
  const {
    param,
    option,
    onSuccess
  } = props

  const extraQuery = `
    param {
      ... PARAM
    }
  `
  const extraQueryFragments = [PARAM, OPTION, USER]

  let valueAs = null
  if (param.optionsType === 'Hash') {
    valueAs = 'yaml'
  } else if (param.optionsType === 'Pair') {
    valueAs = 'yaml-pair'
  } else if (param.optionsType === 'List') {
    valueAs = 'yaml-list'
  }

  return (
    <Form forRecord={option} onSuccess={onSuccess} extraQuery={extraQuery} extraQueryFragments={extraQueryFragments}>
      <div className={Classes.DIALOG_BODY}>
        <Errors />
        <Input field="paramId ID" as="hidden" />
        <Input field="value String!" autoFocus as={valueAs} label="Value" />
        <Input
          field="description String"
          as="textarea"
          optionalLabel="(markdown)"
          inputProps={{ rows: 7 }}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <FormSubmit label={option.id ? "Save" : "Create"} />
        </div>
      </div>
    </Form>
  )
}

OptionForm.propTypes = {
  option: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
}

export default OptionForm
