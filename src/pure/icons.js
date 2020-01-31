import React from 'react'
import _ from 'lodash'

import {
  RuboCopIcon,
  ESLintIcon,
} from '~/pure/linter-icons'

import {
  RubyIcon,
  JavaScriptIcon,
} from '~/pure/language-icons'

import languages from '~/lists/languages'

export const StyleGuideIcon = (propsWIthStyleGuide) => {

  const {styleGuide, ...props} = propsWIthStyleGuide

  if (styleGuide.linter) {
    if (styleGuide.linter === 'rubocop') {
      return <RuboCopIcon {...props} />
    }
    if (styleGuide.linter === 'eslint') {
      return <ESLintIcon {...props} />
    }
  } else if (styleGuide.language) {
    return <LanguageIcon language={styleGuide.language} {...props} />
  } else {
    return <img {...props} src='/images/style-guide-no-icon.png' />
  }
}

export const OrganizationIcon = (propsWithOrganization) => {
  const { organization, ...props } = propsWithOrganization
  return <img {...props} src={organization.logoUrl || '/images/organization-no-logo.png'}  />
}

export const LanguageIcon = (propsWithLanguage) => {
  const { language, ...props } = propsWithLanguage
  const src = _.find(languages, {value: language}).iconSrc
  return <img {...props} src={src} />
}