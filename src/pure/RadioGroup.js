import React from 'react'
import PropTypes from 'prop-types'

import {
  Radio,
  RadioGroup,
} from '@blueprintjs/core'

import _ from 'lodash'

const PureRadioGroup = (props) => {
  let collection = props.collection
  const includeBlank = props.includeBlank

  const itemRenderer = ({label, value}) => {
    return <Radio label={label} value={value} key={value} />
  }

  return <RadioGroup
            label={props.label}
            onChange={props.onChange}
            selectedValue={props.value}
          >
    {props.collection.map(itemRenderer)}
  </RadioGroup>
}

PureRadioGroup.propTypes = {
  // collection: PropTypes.oneOf([PropTypes.array, PropTypes.object]).isRequired,
  value: PropTypes.any
}

export default PureRadioGroup