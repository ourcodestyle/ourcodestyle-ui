/*
  Display as 2 inputs but return back value as YAML like:
  ---
  "key": value
*/
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import YAML from 'yaml'
import { Pair } from 'yaml/types'

import {
  FormGroup,
  InputGroup
} from '@blueprintjs/core'

const YamlPair = (props) => {
  const {
    onChange,
    value: fieldValue
  } = props

  const fieldValueObject = YAML.parse(fieldValue) || { "": "" }
  const currentKey = Object.keys(fieldValueObject)[0] || ""
  const currentValue = fieldValueObject[currentKey] || ""

  const [key, setKey] = useState(currentKey)
  const [value, setValue] = useState(currentValue)

  const setPair = (newKey, newValue) => {
    if (newKey   !== key)   setKey(newKey)
    if (newValue !== value) setValue(newValue)

    const newFieldValue = YAML.stringify(new Pair(newKey, newValue))

    onChange({target: { value: newFieldValue }})
  }

  return <div>
  <FormGroup style={{ display: 'inline-block' }}>
    <InputGroup
      placeholder="Key"
      value={key}
      onChange={e => setPair(e.target.value, value)}
      />
  </FormGroup>
  <FormGroup style={{ display: 'inline-block', marginLeft: 20 }}>
    <InputGroup
      placeholder="Value"
      value={value}
      onChange={e => setPair(key, e.target.value)}
      />
  </FormGroup>
  </div>
}

YamlPair.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

export default YamlPair
