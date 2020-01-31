import React from 'react'
import _ from 'lodash'

import linters from '~/lists/linters'

export const RuboCopIcon = (props) => {
  const data = _.find(linters, {value: "rubocop"})
  return <img {...props} src={data.iconSrc} />
}

export const ESLintIcon = (props) => {
  const data = _.find(linters, {value: "eslint"})
  return <img {...props} src={data.iconSrc} />
}