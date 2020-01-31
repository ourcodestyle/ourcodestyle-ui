import React from 'react'
import queryString from 'query-string'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {compose} from 'redux'
import gql from "graphql-tag"
import Storage from '~/services/storage'

import { PROFILE_QUERY } from '~/components/App'

const VERIFY_GQL = gql`
  mutation ($provider: OAuthProvider!, $code: String!){
    authVerifyCode(provider: $provider, code: $code){
      token
    }
  }
`

const ACCEPT_INVITATION_GQL = gql`
  mutation ($secret: String!){
    acceptInvitation(secret: $secret){
      organization {
        id
        domain
        name
      }
    }
  }
`

class AuthCallbackPage extends React.Component {

  componentDidMount() {
    const history = this.props.history
    const provider = this.props.match.params.provider
    const searchQuery = queryString.parse(this.props.location.search)
    const code = searchQuery.code
    const invitation = searchQuery.invitation
    const apolloClient = this.props.client
    const component = this

    component.setState({
      authVerifyCodeFailure: false
    })

    apolloClient.mutate({
      mutation: VERIFY_GQL,
      variables: { provider, code }
    }).then(({data}) => {
      const token = data.authVerifyCode.token
      Storage.set('userToken', token)

      if (invitation){
        console.log('HAS invitation, try profile query')
        apolloClient.mutate({
          mutation: ACCEPT_INVITATION_GQL,
          variables: { secret: invitation }
        }).then(({data}) => {
          const organization = data.acceptInvitation.organization
          try {
            apolloClient.query({query: gql(PROFILE_QUERY), fetchPolicy: "network-only"}).then(result => {
              history.push(`/organizations/${organization.domain}`)
            })
          } catch(e) {
            debugger
          }
        }).catch(error => {
          console.error('error in inner Mutation');
          console.error(error);
        })

      } else {
        console.log('no invitation, try profile query')
        apolloClient.query({query: gql(PROFILE_QUERY), fetchPolicy: "network-only"}).then(result => {
          const returnTo = Storage.get('returnTo')
          if (returnTo) {
            history.push('/redirect')
          } else {
            history.push('/')
          }
        })
      }

    }).catch(error => {
      console.log('outer Error')
      console.dir(error)
      component.setState({authVerifyCodeFailure: true})
    })
  }

  render(){
    const authVerifyCodeFailure = this.state && this.state.authVerifyCodeFailure
    return <div>{
      authVerifyCodeFailure ?
        'Failed to verify the callback code, please try to sign-in again'
      :
        'Verifying...'
    }
    </div>
  }
}

export default compose(withApollo, withRouter)(AuthCallbackPage)
