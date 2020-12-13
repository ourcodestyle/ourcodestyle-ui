import React from 'react'

import {
  Card,
  Button,
} from '@blueprintjs/core'

import { Query } from "react-apollo"
import gql from "graphql-tag"

import { withCurrentUser } from '~/contexts'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import UserIconWithName from '~/pure/UserIconWithName'


const INVITATION_QUERY = gql`
  query($secret: String){
    invitation(secret: $secret){
      project {
        id
        name
        domain
        logoUrl
      }
      inviter {
        id
        name
        pictureUrl
      }
    }
  }
`

class AuthLinkPage extends React.Component {

  authAndAcceptButton(){
    console.log('this.props');
    console.dir(this.props);
    const { history } = this.props
    const secret = this.props.match.params.secret
    const onClick = () => {
      history.push(`/auth/github?invitation=${secret}`)
    }

    return <div>
      <p>Press button below to authenticate with your GitHub account in order to accept invitation</p>
      <Button text="Authorize and Accept Invitation" onClick={onClick} />
    </div>
  }

  acceptButton(){
    return <Button text="Accept Invitation" />
  }

  gotToProjectButton(){

  }


  content({project, inviter}){
    const {currentUser} = this.props

    return <Card style={{textAlign: 'center', marginTop: 20}}>
      <div className="project-logo-holder">
        <img src={project.logoUrl || '/images/project-no-logo.png'}  />
      </div>

      <h3 style={{ fontWeight: 'normal', margin: 30 }}>You have been invited to join project <b>{project.name}</b> by user <UserIconWithName user={inviter} /></h3>

      <div style={{ marginTop: 30 }}>
        { currentUser.id && this.acceptButton() }
        { !currentUser.id && this.authAndAcceptButton() }
      </div>

    </Card>
  }

  render(){
    const secret = this.props.match.params.secret
    return <Query variables={{secret}} query={INVITATION_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return "Loading"
        if (error) return "Error :("
        return this.content(data.invitation)
      }}
    </Query>
  }
}

export default compose(withCurrentUser, withRouter)(AuthLinkPage)
