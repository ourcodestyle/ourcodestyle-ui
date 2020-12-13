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
  fragment ActiveInvitaions on Project {
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

const PROJECT_QUERY = gql`
  query readProject($domain: String!){
    project(domain: $domain){
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
        project {
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
    projectLogoUpload(id: $id, file: $file) {
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

  dashboardTab(project){
    return <div style={{display: 'grid', gridTemplateColumns: '500px 1fr', gridColumnGap: '60px', width: '100%' }}>
      {this.styleGuidesTab(project)}
      {this.activityTab(project)}
    </div>
  }

  styleGuidesTab(project){

    const { currentUserCan } = this.props

    const addStyleGuide = () => {
      this.props.actions.openModal({modalName: "CreateStyleGuide",
      modalProps: { projectId: project.id, projectDomain: project.domain }})
    }

    const maxStyleGuidesReached = project.styleGuides.length >= project.maxStyleGuidesCount;

    return <div>
        <h2 className="section-title">Style Guides</h2>
        <HTMLTable bordered striped>
          <tbody>
          { project.styleGuides.map((styleGuide) => (
            <tr key={styleGuide.id}>
              <td>
                <StyleGuideIcon style={{height: 32}} styleGuide={styleGuide} />
                { !styleGuide.isPublic && <Icon color="#555" icon="lock" title="private" style={{ position: 'absolute', marginLeft: -5, marginTop: 20 }} /> }
              </td>
              <td>
              <Link to={`/projects/${styleGuide.project.domain}/style-guides/${styleGuide.id}`}>
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

        { currentUserCan({project})("addStyleGuide") &&
          <div>
            <Button
              disabled={maxStyleGuidesReached}
              style={{marginTop: 20}}
              onClick={addStyleGuide}
              text="Add Style Guide"
              icon="add"
              />
            { maxStyleGuidesReached && <div className="small-notice">max limit reached ({project.maxStyleGuidesCount})</div> }
          </div>
        }
    </div>
  }

  activityTab(project){
    const scope = { projectId: { value: project.id, type: 'ID!' } }
    return <div>
      <h2 className="section-title">Activity</h2>
      <Activity scope={scope} />
    </div>
  }

  membersTab(project){
    const projectId = project.id
    const domain = this.props.match.params.projectDomain
    const { actions, currentUser } = this.props

    const onRevokeSuccess = (cache, { data: { revokeInvitation } }) => {
      let data = cache.readQuery({ query: PROJECT_QUERY, variables: { domain } })
      data.project.invitations = _.reject(data.project.invitations, {id: revokeInvitation.id})
      cache.writeQuery({
        query: PROJECT_QUERY,
        variables: { domain },
        data
      })
    }

    const projectPolicy = policy(currentUser, project).project

    return <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr' }}>
        <div>
          <MembersList
            projectDomain={project.domain}
            canAssignRole={projectPolicy.canAssignRole()}
            />
        </div>
        <div>
            { projectPolicy.canInviteMembers() &&
          <div>
            <h3>Add Members</h3>
            <div>
              <Button
                text="Invite by Special Link"
                onClick={() => actions.openModal({modalName: "InviteProjectByLink", modalProps: {project}})}
              />
            </div>
            <div style={{ marginTop: 5 }}>
            <Button
                text="Add by GitHub Account"
                onClick={() => actions.openModal({modalName: "InviteProjectByGithubAccountLink", modalProps: {project}})}
              />
            </div>
          </div>
          }
          { projectPolicy.canInviteMembers() &&
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
              {project.invitations.map(invitation => <tr key={invitation.id}>
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

  settingsTab(project){
    return <div>Settings</div>
  }

  editProjectForm(project){

  }

  projectHead(project){
    const { actions, currentUserCan } = this.props

    const canEdit = currentUserCan({project})("edit")

    let logo = <div className="project-logo-holder">
      <img src={project.logoUrl || '/images/project-no-logo.png'}  />
    </div>

    if (canEdit) {
      logo = <Mutation mutation={UPLOAD_LOGO_GQL}>
        {(uploadLogo, { data }) => (
          <div className="project-logo-holder">
                <input
                  onChange={({ target: { validity, files } }) =>
                        validity.valid && uploadLogo({ variables: { id: project.id, file: files[0] } })
                      }
                  id="upload-logo-file" type="file" name="file" style={{display: 'none'}} />
                <label htmlFor="upload-logo-file" className="edit-cover">
                  Change
                </label>
            <img src={project.logoUrl || '/images/project-no-logo.png'}  />
          </div>
        )}
      </Mutation>
    }

    return <div className="project-logo-and-name-container">
            <div className="project-logo-and-name">
              { logo }
              <div>
                <h1 className="project-name">{project.name}</h1>
                { canEdit &&
                    <Button
                      style={{ display: 'inline-block', marginBottom: 20 }}
                      text="Edit Project Profile"
                      icon="edit"
                      onClick={() => actions.openModal({modalName: "EditProjectProfile", modalProps: {project}}) }
                    />
                }
                { project.description && <div>{project.description}</div> }
              </div>
            </div>
          </div>
  }

  render() {
    const domain = this.props.match.params.projectDomain
    const currentUser = this.props.currentUser

    const selectedTab = this.props.match.path.split('/')[3] || 'dashboard'

    return <Query
      variables={{domain}}
      query={PROJECT_QUERY}
    >
      {({ loading, error, data }) => {
        if (loading) return <p>Loading...</p>;
        if (error) {
          return <p>Error :(</p>
        }

        const project = data.project

        let tabContent = null
        if (selectedTab == 'dashboard'){
          tabContent = this.dashboardTab(project)
        } else if (selectedTab == 'members'){
          tabContent = this.membersTab(project)
        } else if (selectedTab == 'settings'){
          tabContent = this.settingsTab(project)
        }


        return <div>
          <div className="project-title">
            { this.projectHead(project) }
            <div className="project-tabs">
              <ShowTabs projectDomain={project.domain} selectedTab={selectedTab} canEdit={false} />
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
