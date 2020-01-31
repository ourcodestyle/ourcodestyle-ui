import React from 'react'
import PropTypes from 'prop-types'
import {
  Breadcrumbs,
} from '@blueprintjs/core'

class Path extends React.Component {
  render() {
    const { styleGuide, rule } = this.props
    const category = rule.category
    const organization = styleGuide.organization

    let items = [
      { text: organization.name,
        href: `/organizations/${organization.domain}`
      },
      { text: styleGuide.name,
        href: `/organizations/${organization.domain}/style-guides/${styleGuide.id}`
      },
    ]
    if (category) {
      items.push({
        text: category.name,
        href: `/organizations/${organization.domain}/style-guides/${styleGuide.id}#${category.name}`
      })
    }
    items.push({ text: rule.name })

    const renderCurrentBreadcrumb = ({ text }) => {
      return <strong>{text}</strong>
    }
    return <Breadcrumbs
      items={items}
      currentBreadcrumbRenderer={renderCurrentBreadcrumb}
    />

  }
}

Path.propTypes = {
  styleGuide: PropTypes.object.isRequired,
  rule: PropTypes.object.isRequired
}

export default Path
