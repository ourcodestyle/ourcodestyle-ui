import React from 'react'
import PropTypes from 'prop-types'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import { Query, graphql } from "react-apollo"
import gql from "graphql-tag"
import { Mutation } from "react-apollo"
import {
  Button,
  Intent,
  Icon,
  HTMLTable,
} from '@blueprintjs/core'
import PrivacyIcon from '~/pure/PrivacyIcon'

import {withCurrentUser} from '~/contexts'
import {actionsConnect} from '~/utils/components'
import {compose} from 'redux'
import _ from 'lodash'

import {openModal} from '~/redux/globalActions'
import ShowTabs from './components/ShowTabs'
import Activity from '~/components/Activity/Activity'

import StyleGuideCard from '~/components/HomePage/components/StyleGuideCard'
import CopyToClipboard from '~/pure/CopyToClipboard'

import {
  StyleGuideIcon
} from '~/pure/icons'

import { policy } from '~/utils/userUtils'

import MembersList from './components/MembersList'
import {USER} from '~/gql/fragments'
import UserIconWithName from '~/pure/UserIconWithName'

export const GQL_FRAGMENT_ACTIVE_INVITATIONS = gql`
  fragment ActiveInvitaions on Organization {
    invitations(active: true) {
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

const ORGANIZATION_QUERY = gql`
  query readOrganization($domain: String!){
    organization(domain: $domain){
      id
      name
      domain
      website
      description
      logoUrl
      maxStyleGuidesCount
      styleGuides {
        id
        name
        language
        linter
        isPublic
        organization {
          id
          domain
        }
        createdByUser {
          ... USER
        }
      }
      memberships {
        id
        role
        user {
          id
          name
          pictureUrl
          nickname
        }
      }
      ... ActiveInvitaions
      membershipRequests(status: "pending") {
        id
        status
        user {
          ... USER
        }
      }
    }
  }
  ${GQL_FRAGMENT_ACTIVE_INVITATIONS}
  ${USER}
`

const UPLOAD_LOGO_GQL = gql`
  mutation($id: ID!, $file: Upload!) {
    organizationLogoUpload(id: $id, file: $file) {
      id
      logoUrl
    }
  }
`

const REVOKE_INVITATION_GQL = gql`
  mutation($secret: String!) {
    revokeInvitation(secret: $secret) {
      id
      expiresAt
    }
  }
`

const buildLink = (secret) => `${window.location.origin}/authLink/${secret}`

class Show extends React.Component {

  dashboardTab(organization){
    return <div style={{display: 'grid', gridTemplateColumns: '500px 1fr', gridColumnGap: '60px', width: '100%' }}>
      {this.styleGuidesTab(organization)}
      {this.activityTab(organization)}
    </div>
  }

  styleGuidesTab(organization){

    const { currentUserCan } = this.props

    const addStyleGuide = () => {
      this.props.actions.openModal({modalName: "CreateStyleGuide",
      modalProps: { organizationId: organization.id, organizationDomain: organization.domain }})
    }

    const maxStyleGuidesReached = organization.styleGuides.length >= organization.maxStyleGuidesCount;

    return <div>
        <h2 className="section-title">Style Guides</h2>
        <HTMLTable bordered striped>
          <tbody>
          { organization.styleGuides.map((styleGuide) => (
            <tr key={styleGuide.id}>
              <td>
                <StyleGuideIcon style={{height: 32}} styleGuide={styleGuide} />
                { !styleGuide.isPublic && <Icon color="#555" icon="lock" title="private" style={{ position: 'absolute', marginLeft: -5, marginTop: 20 }} /> }
              </td>
              <td>
              <Link to={`/organizations/${styleGuide.organization.domain}/style-guides/${styleGuide.id}`}>
                {styleGuide.name}
              </Link>
              </td>
              <td>
                { styleGuide.createdByUser && <UserIconWithName user={styleGuide.createdByUser} /> }
              </td>
            </tr>
          ))}
          </tbody>
        </HTMLTable>

        { currentUserCan({organization})("addStyleGuide") &&
          <div>
            <Button
              disabled={maxStyleGuidesReached}
              style={{marginTop: 20}}
              onClick={addStyleGuide}
              text="Add Style Guide"
              icon="add"
              />
            { maxStyleGuidesReached && <div className="small-notice">max limit reached ({organization.maxStyleGuidesCount})</div> }
          </div>
        }
    </div>
  }

  activityTab(organization){
    const scope = { organizationId: { value: organization.id, type: 'ID!' } }
    return <div>
      <h2 className="section-title">Activity</h2>
      <Activity scope={scope} />
    </div>
  }

  membersTab(organization){
    const organizationId = organization.id
    const domain = this.props.match.params.organizationDomain
    const { actions, currentUser } = this.props

    const onRevokeSuccess = (cache, { data: { revokeInvitation } }) => {
      let data = cache.readQuery({ query: ORGANIZATION_QUERY, variables: { domain } })
      data.organization.invitations = _.reject(data.organization.invitations, {id: revokeInvitation.id})
      cache.writeQuery({
        query: ORGANIZATION_QUERY,
        variables: { domain },
        data
      })
    }

    const organizationPolicy = policy(currentUser, organization).organization

    return <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr' }}>
        <div>
          <MembersList
            organizationDomain={organization.domain}
            canAssignRole={organizationPolicy.canAssignRole()}
            />
        </div>
        <div>
            { organizationPolicy.canInviteMembers() &&
          <div>
            <h3>Add Members</h3>
            <div>
              <Button
                text="Invite by Special Link"
                onClick={() => actions.openModal({modalName: "InviteOrganizationByLink", modalProps: {organization}})}
              />
            </div>
            <div style={{ marginTop: 5 }}>
            <Button
                text="Add by GitHub Account"
                onClick={() => actions.openModal({modalName: "InviteOrganizationByGithubAccountLink", modalProps: {organization}})}
              />
            </div>
          </div>
          }
          { organizationPolicy.canInviteMembers() &&
          <div>
            <h3 style={{ marginTop: 50 }}>Active Invitation Links</h3>
            <HTMLTable striped bordered>
              <thead>
                <tr>
                  <th>Created</th>
                  <th colSpan={2}>Invitation Link</th>
                </tr>
              </thead>
              <tbody>
              {organization.invitations.map(invitation => <tr key={invitation.id}>
                <td><TimeAgo date={invitation.createdAt} /></td>
                <td>
                  <a href={buildLink(invitation.secret)}>{invitation.secret}</a>
                  <div style={{float: 'right', marginLeft: 10}}>
                    <CopyToClipboard text={buildLink(invitation.secret)} buttonProps={{small: true}} />
                  </div>
                  {invitation.emailInvitation && <div> (sent to {invitation.emailInvitation.email})</div>}
                </td>
                <td>
                  <Mutation
                    mutation={REVOKE_INVITATION_GQL}
                    update={onRevokeSuccess}
                    >
                    {(revokeInvitation, { data, loading, error }) => (
                      <Button
                        text="revoke"
                        intent={Intent.DANGER}
                        loading={loading}
                        small
                        onClick={() => revokeInvitation({variables: { secret: invitation.secret }}) }
                      />
                    )}
                  </Mutation>
                </td>
              </tr>)}
              </tbody>
            </HTMLTable>
          </div>
          }
        </div>
    </div>
  }

  settingsTab(organization){
    return <div>Settings</div>
  }

  editOrganizationForm(organization){

  }

  organizationHead(organization){
    const { actions, currentUserCan } = this.props

    const canEdit = currentUserCan({organization})("edit")

    let logo = <div className="organization-logo-holder">
      <img src={organization.logoUrl || '/images/organization-no-logo.png'}  />
    </div>

    if (canEdit) {
      logo = <Mutation mutation={UPLOAD_LOGO_GQL}>
        {(uploadLogo, { data }) => (
          <div className="organization-logo-holder">
                <input
                  onChange={({ target: { validity, files } }) =>
                        validity.valid && uploadLogo({ variables: { id: organization.id, file: files[0] } })
                      }
                  id="upload-logo-file" type="file" name="file" style={{display: 'none'}} />
                <label htmlFor="upload-logo-file" className="edit-cover">
                  Change
                </label>
            <img src={organization.logoUrl || '/images/organization-no-logo.png'}  />
          </div>
        )}
      </Mutation>
    }

    return <div className="organization-logo-and-name-container">
            <div className="organization-logo-and-name">
              { logo }
              <div>
                <h1 className="organization-name">{organization.name}</h1>
                { canEdit &&
                    <Button
                      style={{ display: 'inline-block', marginBottom: 20 }}
                      text="Edit Organization Profile"
                      icon="edit"
                      onClick={() => actions.openModal({modalName: "EditOrganizationProfile", modalProps: {organization}}) }
                    />
                }
                { organization.description && <div>{organization.description}</div> }
              </div>
            </div>
          </div>
  }

  render() {
    const domain = this.props.match.params.organizationDomain
    const currentUser = this.props.currentUser

    const selectedTab = this.props.match.path.split('/')[3] || 'dashboard'

    return <Query
      variables={{domain}}
      query={ORGANIZATION_QUERY}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          return <p>Error :(</p>
        }

        const organization = data.organization

        let tabContent = null
        if (selectedTab == 'dashboard'){
          tabContent = this.dashboardTab(organization)
        } else if (selectedTab == 'members'){
          tabContent = this.membersTab(organization)
        } else if (selectedTab == 'settings'){
          tabContent = this.settingsTab(organization)
        }


        return <div>
          <div className="organization-title">
            { this.organizationHead(organization) }
            <div className="organization-tabs">
              <ShowTabs organizationDomain={organization.domain} selectedTab={selectedTab} canEdit={false} />
            </div>
          </div>
          { tabContent }
        </div>
      }}
    </Query>
  }
}

export default compose(
  withCurrentUser,
  actionsConnect({openModal})
)(Show)
