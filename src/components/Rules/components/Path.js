import React from 'react'
import PropTypes from 'prop-types'
import {
  Breadcrumbs,
} from '@blueprintjs/core'

class Path extends React.Component {
  render() {
    const { styleGuide, rule } = this.props
    const category = rule.category
    const project = styleGuide.project

    let items = [
      { text: project.name,
        href: `/projects/${project.domain}`
      },
      { text: styleGuide.name,
        href: `/projects/${project.domain}/style-guides/${styleGuide.id}`
      },
    ]
    if (category) {
      items.push({
        text: category.name,
        href: `/projects/${project.domain}/style-guides/${styleGuide.id}#${category.name}`
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
