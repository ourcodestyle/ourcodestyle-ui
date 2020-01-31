import React from 'react'
import Api from '~/api'
import { withApollo } from 'react-apollo'
import gql from "graphql-tag"
import { Mutation } from "react-apollo"

import queryString from 'query-string'

const AUTH_GQL = gql`
  mutation ($provider: OAuthProvider!, $invitation: String){
    auth(provider: $provider, invitation: $invitation){
      requestUrl
    }
  }
`

class AuthPage extends React.Component {

  componentDidMount() {
    console.log('this.props');
    console.dir(this.props);
    const provider = this.props.match.params.provider
    const apolloClient = this.props.client
    const invitation = queryString.parse(this.props.location.search).invitation

    apolloClient.mutate({
      mutation: AUTH_GQL,
      variables: { provider, invitation }
    }).then(result => {
      window.location.href = result.data.auth.requestUrl
    })
  }

  render() {
    return <p>Redirecting to authentication provider ...</p>
  }
}

export default withApollo(AuthPage)