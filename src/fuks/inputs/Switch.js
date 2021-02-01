import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import {
  Switch as BPSwitch,
} from '@blueprintjs/core'

const Switch = (props) => {
  const {
    label,
    inputProps,
    formValue,
    fieldConfig,
  } = props

  let checked
  if (fieldConfig.isArray) {
    checked = formValue.includes(inputProps.value)
  } else {
    checked = formValue
  }

  const setValue = () => {
    // let value
    // if (fieldConfig.isArray) {
    //   if (event.target.checked) {
    //     value = _.uniq(formValue.concat(inputProps.value))
    //   } else {
    //     value = _.remove(formValue, x => x === value)
    //   }
    // } else {
    //   value = event.target.checked
    // }
    inputProps.onChange({
      target: {
        checked: !checked,
        value: inputProps.value
      }
    })
    // inputProps.onChange({ target: { value } })
  }

  return (
    <BPSwitch
      label={label}
      checked={checked}
      onChange={setValue}
    />
  )
}

Switch.propTypes = {
  label: PropTypes.string,
  inputProps: PropTypes.object,
  fieldConfig: PropTypes.object,
  formValue: PropTypes.any
}

export default Switch
