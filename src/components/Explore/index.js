import React from 'react'
import { Link } from 'react-router-dom'
import {
  HTMLTable,
} from '@blueprintjs/core'

import QueryComponent from '~/fuks/QueryComponent'

class Explore extends QueryComponent {

  query() {
    return `
      query project($domain: String!) {
        project(domain: $domain) {
          id
          name
          domain
          styleGuides {
            id
            name
            linter
            project {
              id
              name
              domain
            }
          }
        }
        communityStyleGuides {
          id
          name
          linter
          project {
            id
            name
            domain
          }
        }
      }
    `
  }

  queryVariables(){
    return { domain: 'master' }
  }

  renderTable(styleGuides, project){
    return <HTMLTable bordered striped>
    <thead>
      <tr>
        <td>Linter</td>
        <td>Guide Name</td>
        <td>Project</td>
      </tr>
    </thead>
    <tbody>
      { styleGuides.map(styleGuide => {
        return <tr key={styleGuide.id}>
          <td>{styleGuide.linter ? styleGuide.linter : <i>none</i> }</td>
          <td>
            <Link to={`/projects/${styleGuide.project.domain}/style-guides/${styleGuide.id}`}>
              {styleGuide.name}
            </Link>
          </td>
          <td>{styleGuide.project.name}</td>
        </tr>
      }) }
    </tbody>
  </HTMLTable>
  }

  content(){
    return <div style={{ margin: 'auto', width: 300, textAlign: 'center' }}>
      <h1 className="section-title">Master Style Guides</h1>
      {this.renderTable(this.state.project.styleGuides)}

      <h1 className="section-title">Community Style Guides</h1>
      {this.renderTable(this.state.communityStyleGuides)}
    </div>
  }
}

  export default Explore
