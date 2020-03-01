import React from 'react'
import _ from 'lodash'

import languages from '~/lists/languages'

const buildIcon = (languageName) => {
  const { iconSrc } = _.find(languages, {value: languageName})

  return props => <img {...props} src={iconSrc} />
}

export const RubyIcon = buildIcon('ruby')
export const JavaScriptIcon = buildIcon('javascript')
