import React from 'react'
import _ from 'lodash'

import linters from '~/lists/linters'

const buildIcon = (linterName) => {
  const { iconSrc } = _.find(linters, {value: linterName})

  return props => <img {...props} src={iconSrc} />
}

export const RuboCopIcon = buildIcon('rubocop')
export const ESLintIcon = buildIcon('eslint')
