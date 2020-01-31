import React from 'react'
import { compose } from 'redux'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'


import {
  Dialog,
  Button,
  Intent,
  Classes,
} from '@blueprintjs/core'

import { withCurrentUser } from '~/contexts'
import {
  Form,
  Input,
  FormSubmit,
  Errors
} from '~/fuks'

const REQUEST_MEMBERSHIP_GQL = gql`
  mutation ($organizationId: ID!){
    requestMembership(organizationId: $organizationId){
      user {
        id
        membershipRequests {
          id
          status
          organizationId
        }
      }
    }
  }
`

class RequestAccessToOrganizationModal extends React.Component {

  constructor(props){
    super(props)
    this.state = { pending: false }
  }

  async requestInvitation(){
    this.setState({ pending: true })
    const { client, organizationId } = this.props

    const mutation = REQUEST_MEMBERSHIP_GQL
    const variables = { organizationId }
    const response = await client.mutate({ mutation, variables })

    const membershipInvitation = response.data.requestMembership
    console.log('membershipInvitation');
    console.dir(membershipInvitation);
  }

  render(){
    const {
      isOpen,
      closeModal,
      currentUser,
      organizationId
    } = this.props

    const membershipRequest = _.find(currentUser.membershipRequests, {organizationId})

    const onClose = (...args) => {
      closeModal()
    }
    const onSuccess = (styleGuide) => {
      closeModal()
    }

    const title = membershipRequest ? "Pending Approval" : "Request membership to Organization"

    return (
      <Dialog
        icon="lock"
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      >
        { !membershipRequest && this.requestDialog() }
        { membershipRequest && membershipRequest.status === 'pending' && this.pleaseWait() }
        { membershipRequest && membershipRequest.status === 'declined' && this.wasDeclined() }
      </Dialog>
    )
  }

  requestDialog(){
    return <div>
        <div className={Classes.DIALOG_BODY}>
          By clicking below button you will request membership to organization.
          Please wait until admin of organization will confirm your membership.
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  loading={this.state.pending}
                  intent={Intent.PRIMARY}
                  text="Request Membership"
                  onClick={this.requestInvitation.bind(this)}
                />
            </div>
        </div>
    </div>
  }

  pleaseWait(){
    return <div>
        <div className={Classes.DIALOG_BODY}>
          <p>You have requested membership in this organization.</p>
          <p>Please wait until admin of organization will confirm your membership.</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            </div>
        </div>
    </div>
  }

  wasDeclined(){
    return <div>
        <div className={Classes.DIALOG_BODY}>
          <p>You have requested membership in this organization.</p>
          <p>But admin has <b>declined</b> your request</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            </div>
        </div>
    </div>
  }

}

export default compose(
  withCurrentUser,
  withRouter,
  withApollo,
)(RequestAccessToOrganizationModal)