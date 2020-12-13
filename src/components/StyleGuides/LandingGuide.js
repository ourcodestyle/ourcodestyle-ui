import React from 'react'
import Show from './Show'

import QueryComponent from '~/fuks/QueryComponent'

class LandingGuide extends QueryComponent {

  query(){
    return `
    query ($slug: String) {
      project(domain: "master") {
        id
        styleGuides(slug: $slug) {
          id
        }
      }
    }
    `
  }

  queryVariables(){
    return { slug: this.props.slug }
  }

  queryLoaded({project}) {
    this.setState({
      styleGuideId: project.styleGuides[0].id
    })
  }

  content() {
    return <Show styleGuideId={this.state.styleGuideId} />
  }
}

export default LandingGuide
