import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {
  Intent,
  FormGroup,
  TextArea,
  InputGroup,
  Switch,
} from '@blueprintjs/core'

import Select from '~/pure/Select'
import RadioGroup from '~/pure/RadioGroup'

import Code from '~/pure/Code'
import { withForm } from '~/contexts'

const InputTypes = [
  'codearea',
  'hidden',
  'yaml',
  'yaml-list',
  'yaml-pair',
  'radio',
  'select',
  'textarea',
]

import YamlText from './inputs/YamlText'
import YamlList from './inputs/YamlList'
import YamlPair from './inputs/YamlPair'

class Input extends React.Component {

  constructor(props){
    super(props)
    this.inputRef = null
    this.setInputRef = (element) => {
      this.inputRef = element
    }
  }

  componentDidMount() {
    if (this.props.autoFocus){
      if (this.inputRef) this.inputRef.focus()
    }
  }

  render(){
    let {
      form,
      field,
      label,
      placeholder,
      errors,
      onChangeField,
      as,
      collection,
      includeBlank,
      autoFocus,
      inputProps: extraInputProps,
      hideOptionalLabel,
      disabled,
      optionalLabel,
    } = this.props

    const [fieldName, fieldType] = _.split(field, ' ')
    const isRequired = _.endsWith(fieldType, "!")

    if (typeof(label) === 'undefined'){
      label = _.capitalize(fieldName)
    }

    const value = this.props.hasOwnProperty('value') ? this.props.value : form[fieldName]

    const fieldError = _.find(errors, {field: fieldName})

    const helperText = fieldError ? fieldError.messages.join('. ') : ""
    const intent = fieldError ? Intent.DANGER : null

    const inputRef = this.setInputRef
    const inputProps = {
      inputRef,
      intent,
      value,
      placeholder: placeholder || label,
      onChange: onChangeField(fieldName),
      disabled,
      ...extraInputProps
    }

    let input

    if (as === "hidden") {
      return <input type="hidden" value={value} ref={inputProps.inputRef} />
    } else if (as === "textarea") {
      input = <TextArea style={{width: '100%', fontFamily: 'Courier' }} {...inputProps} />
    } else if (as === "codearea") {
      input = <Code style={{ width: '100%' }} readOnly={false} {...inputProps} />
    } else if (as === "select") {
      input = <Select collection={collection} includeBlank={includeBlank} {...inputProps} />
    } else if (as === "radio") {
      input = <RadioGroup collection={collection} includeBlank={includeBlank} {...inputProps} />
    } else if (as === "yaml") {
      input = <Code {...inputProps} language="yaml" />
    } else if (as === "yaml-list") {
      input = <YamlList {...inputProps} />
    } else if (as === "yaml-pair") {
      // returning as is
      return <YamlPair {...inputProps} />
    } else if (as === "switch") {
      return <FormGroup>
        <Switch label={label} defaultChecked={inputProps.value} onChange={inputProps.onChange} {..._.omit(inputProps, 'value')}  />
      </FormGroup>
    } else {
      input = <InputGroup {...inputProps} />
    }

    optionalLabel = optionalLabel || ( hideOptionalLabel ? '' : '(optional)' )
    return <FormGroup {...{label, helperText, intent}} labelInfo={ isRequired ? '' : optionalLabel }>
            {input}
          </FormGroup>
  }
}

Input.propTypes = {
  form: PropTypes.object.isRequired,
  field: PropTypes.string.isRequired,
  onChangeField: PropTypes.func.isRequired,
  label: PropTypes.string,
  errors: PropTypes.array,
  as: PropTypes.oneOf(InputTypes),
  autoFocus: PropTypes.bool,
  // collection: PropTypes.oneOf([PropTypes.array, PropTypes.object])
}

export default withForm(Input)
