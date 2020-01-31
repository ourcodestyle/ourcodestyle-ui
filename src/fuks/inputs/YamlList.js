/*
  Display as 2 inputs but return back value as YAML like:
  ---
  "key": value
*/
import React, { useState } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import YAML from 'yaml'

import {
  FormGroup,
  TextArea,
} from '@blueprintjs/core'

const YamlList = (props) => {
  const {
    onChange,
    value: fieldValue
  } = props

  const fieldValueList = YAML.parse(fieldValue) || []
  const [value, setValue] = useState(fieldValueList.join("\n"))

  const setFieldValue = (newValue) => {
    setValue(newValue)
    const newFieldValue = YAML.stringify(_.map(newValue.split("\n"), _.trim))
    console.log('newFieldValue');
    console.dir(newFieldValue);
    onChange({target: { value: newFieldValue }})
  }

  return <TextArea
      placeholder="One value per line"
      fill={true}
      value={value}
      onChange={e => setFieldValue(e.target.value)}
      />
}

YamlList.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default YamlList
