import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@blueprintjs/core'
import { push } from 'connected-react-router'

import { Query } from "react-apollo"
import gql from "graphql-tag"

const PROJECTS_QUERY = gql`
  query projects {
    projects {
      id
      name
      domain
      styleGuides {
        id
        name
      }
    }
  }
`

class Index extends React.Component {

  render() {
    const redirectTo = (location) => () => push(location)

    return <Query query={PROJECTS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error :(</p>

        return <div>
          <table className="pt-html-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Style Guides</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.projects.map((project) => {
                  return <tr key={project.id}>
                    <td>
                      <Link to={`/projects/${project.domain}`}>{project.name}</Link>
                    </td>
                    <td>
                      {
                        project.styleGuides.map((styleGuide) => {
                          return <Link key={styleGuide.id} to={`/projects/${project.domain}/style-guides/${styleGuide.id}`}>
                                  {styleGuide.name}
                                </Link>
                        })
                      }
                    </td>
                    <td>
                      <Button onClick={redirectTo(`/projects/${project.domain}/style-guides/new`)}>
                        Create Style Guide
                      </Button>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>


      }}
    </Query>
  }
}

export default Index
