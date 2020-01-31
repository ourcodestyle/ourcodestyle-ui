import React from 'react'
import _ from 'lodash'

import languages from '~/lists/languages'

export const RubyIcon = (props) => {
  const data = _.find(languages, {value: "ruby"})
  return <img {...props} src={data.iconSrc} />
}

export const JavaScriptIcon = (props) => {
  const data = _.find(languages, {value: "javascript"})
  return <img {...props} src={data.iconSrc} />
}