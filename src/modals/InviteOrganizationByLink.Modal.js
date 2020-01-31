import React from 'react'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {compose} from 'redux'
import gql from 'graphql-tag'
import copyToClipboard from 'copy-to-clipboard'

import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  ControlGroup,
  Button,
  InputGroup,
  Classes,
} from '@blueprintjs/core'

const CREATE_INVITATION_GQL = gql`
  mutation ($organizationId: ID!){
    invitationCreate(organizationId: $organizationId){
      id
      secret
      createdAt
      emailInvitation {
        id
        email
      }
    }
  }
`

import {GQL_FRAGMENT_ACTIVE_INVITATIONS} from '~/components/Organizations/Show'

class InviteOrganizationByLink extends React.Component {

  componentWillMount() {
    this.setState({ loading: true })
    this.createInvitation()
  }

  async createInvitation(){
    const {client, organization} = this.props

    const mutation = CREATE_INVITATION_GQL
    const variables = { organizationId: organization.id }
    const response = await client.mutate({ mutation, variables })

    const newInvitation = response.data.invitationCreate

    const cacheId = client.cache.config.dataIdFromObject(organization)

    const organizationFragment = client.readFragment({
      id: cacheId, // `id` is any id that could be returned by `dataIdFromObject`.
      fragment: GQL_FRAGMENT_ACTIVE_INVITATIONS
    })

    const updatedFragment = { invitations: [ ...organizationFragment.invitations, newInvitation ], __typename: "Organization"  }
    client.writeFragment({
      id: cacheId,
      fragment: GQL_FRAGMENT_ACTIVE_INVITATIONS,
      data: updatedFragment
    })

    this.setState({
      loading: false,
      secret: response.data.invitationCreate.secret
    })
  }

  buildLink(secret){
    return `${window.location.origin}/authLink/${secret}`
  }

  render(){
    const { isOpen, closeModal } = this.props
    const { loading, secret } = this.state
    if (!isOpen) return null

    const link = this.buildLink(secret)
    const clickCopyToClipboard = () => {
      copyToClipboard(link)
      AppToaster.show({ message: 'Copied', intent: 'success'})
    }
    return <Dialog icon="link" isOpen={isOpen} onClose={closeModal} title="Invite Members by Special Link">
            <div className={Classes.DIALOG_BODY}>
              { loading && "Loading ..." }
              { !loading && <div>
                Share link below with a person you want to be on your organization
                <ControlGroup fill={true}>
                  <InputGroup style={{width: '432px', fontSize: '11px'}} value={link} readOnly />
                  <Button
                    className="pt-fixed"
                    title="Copy link to clipboard"
                    icon="clipboard"
                    onClick={clickCopyToClipboard}
                    />
                </ControlGroup>
                </div>
              }
            </div>
          </Dialog>
  }

}

export default compose(withRouter, withApollo)(InviteOrganizationByLink)