import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from '@blueprintjs/core'

const PrivacyIcon = ({isPrivate, ...props}) => {
  return <Icon icon={ isPrivate ? "lock" : "globe" } { ...props } />
}

PrivacyIcon.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
}

export default PrivacyIcon