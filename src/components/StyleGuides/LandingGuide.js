import React from 'react'
import Show from './Show'

import QueryComponent from '~/fuks/QueryComponent'

class LandingGuide extends QueryComponent {

  query(){
    return `
    query ($slug: String) {
      organization(domain: "master") {
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

  queryLoaded({organization}) {
    this.setState({
      styleGuideId: organization.styleGuides[0].id
    })
  }

  content() {
    return <Show styleGuideId={this.state.styleGuideId} />
  }
}

export default LandingGuide