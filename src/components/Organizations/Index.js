import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@blueprintjs/core'
import { push } from 'connected-react-router'

import { Query } from "react-apollo"
import gql from "graphql-tag"

const ORGANIZATIONS_QUERY = gql`
  query organizations {
    organizations {
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

    return <Query query={ORGANIZATIONS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>
        if (error) return <p>Error :(</p>

        return <div>
          <table className="pt-html-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Style Guides</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.organizations.map((organization) => {
                  return <tr key={organization.id}>
                    <td>
                      <Link to={`/organizations/${organization.domain}`}>{organization.name}</Link>
                    </td>
                    <td>
                      {
                        organization.styleGuides.map((styleGuide) => {
                          return <Link key={styleGuide.id} to={`/organizations/${organization.domain}/style-guides/${styleGuide.id}`}>
                                  {styleGuide.name}
                                </Link>
                        })
                      }
                    </td>
                    <td>
                      <Button onClick={redirectTo(`/organizations/${organization.domain}/style-guides/new`)}>
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
