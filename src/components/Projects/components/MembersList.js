import React from 'react'
import QueryComponent from '~/fuks/QueryComponent'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withApollo } from 'react-apollo'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { actionsConnect } from '~/utils/components'
import { openModal } from '~/redux/globalActions'
import { removeMembership } from '../redux/actions'

import {
  Spinner,
  Button,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
  Icon,
  Callout,
  RadioGroup,
  Radio,
  Card,
  Elevation,
  HTMLTable,
  ButtonGroup,
} from '@blueprintjs/core'

import { parseErrorMessage } from '~/utils/apiUtils'

const ASSIGN_ROLE_GQL = gql`
  mutation($userId: ID!, $projectId: ID!, $role: MemberRole!) {
    assignRole(userId: $userId, projectId: $projectId, role: $role) {
      id
      role
    }
  }
`

import UserIconWithName from '~/pure/UserIconWithName'
import { PROJECT_MEMBERS } from '~/gql/project'

class MembersList extends QueryComponent {

  query(){
    return PROJECT_MEMBERS
  }

  queryVariables(){
    return { domain: this.props.projectDomain }
  }

  queryLoaded(data) {
    this.setState({
      projectId: data.project.id,
      createdByUserId: data.project.createdByUserId,
      memberships: data.project.memberships,
      pendingInvitations: data.project.personalInvitations,
      membershipRequests: data.project.membershipRequests,
    })
  }

  content(){
    const {
      client,
      actions,
      canAssignRole
    } = this.props

    const {
      memberships,
      pendingInvitations,
      membershipRequests,
      projectId
    } = this.state

    const revokeInvitation = async (id) => {
      const mutation = gql`
        mutation ($id: ID!) {
          revokePersonalInvitation(id: $id) {
            id
            project {
              id
              personalInvitations(status: "pending") {
                id
                nickname
                status
              }
            }
          }
        }
      `
      const variables = { id }
      await client.mutate({ mutation, variables })
    }

    const declineMembershipRequest = async (id) => {
      const mutation = gql`
        mutation ($id: ID!) {
          declineMembershipRequest(id: $id) {
            id
            status
            project {
              id
              membershipRequests(status: "pending") {
                id
                status
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
            }
          }
        }
      `
      const variables = { id }
      await client.mutate({ mutation, variables })
    }


    const removeMemberOnClick = (member) => () => actions.openModal({
      modalName: "ConfirmDelete",
      modalProps: {
        action: removeMembership({ id: member.id }),
        content: `Are you sure you want to remove user ${member.user.nickname} from this Project?`
      }
    })

    return <div>
      <h3>Members ({memberships.length})</h3>
      <HTMLTable style={{ display: 'inline-block' }} bordered condensed striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
        { memberships.map(member => {
            const isCreator = this.state.createdByUserId === member.user.id
            return <tr key={member.id}>
              <td>
                <UserIconWithName user={member.user} />
              </td>
              { canAssignRole && !isCreator && <td>
                <Popover
                    interactionKind={PopoverInteractionKind.CLICK}
                    position={Position.RIGHT}
                    target={<Button intent={Intent.PRIMARY} text={member.role} />}
                    content={<div style={{width: '500px', padding: 20}}>
                      <Mutation
                        mutation={ASSIGN_ROLE_GQL}
                        >
                        {(assignRole, { data, loading, error }) => (
                          <RadioGroup
                            onChange={(event) => assignRole({variables: { userId: member.user.id, projectId, role: event.target.value }}) }
                            selectedValue={member.role}
                          >
                            {error && <Callout intent={Intent.DANGER} title="Failed" style={{marginBottom: 20}}>
                              {parseErrorMessage(error)}
                            </Callout>
                            }
                            <Radio value="admin" large labelElement={<Callout title="Admin" className="selectable-callout" intent={ member.role == "admin" ? Intent.PRIMARY : null} icon={null}>
                            Can change project settings, can invite users, can change user roles, can remove users.
                            Can moderate other users activities (style-guides, rules, comments)
                          </Callout>}
                            />
                            <Radio value="user" large>
                              <Callout title="User" className="selectable-callout" intent={ member.role == "user" ? Intent.PRIMARY : null} icon={null}>
                                Can vote, comment, and create new style-guides and rules.
                              </Callout>
                            </Radio>
                          </RadioGroup>
                          )}
                        </Mutation>
                        <Button text="Remove from Members" icon="trash" onClick={removeMemberOnClick(member)} />
                    </div>}
                >
                </Popover>
              </td>
              }
              { !canAssignRole && !isCreator && <td>{member.role}</td> }
              { isCreator && <td>{member.role} & creator</td> }
            </tr>
            }
          )}
          { pendingInvitations.length > 0 &&
            <tr>
              <td colSpan={2}><b>Pending Invitation</b></td>
            </tr>
          }
          { pendingInvitations.map(invitation =>
            <tr key={"personal-invitation-" + invitation.id}>
              <td>{invitation.nickname}</td>
              <td>
                <span>pending</span>
                <Button
                  text="Revoke"
                  small
                  style={{marginLeft: 10}}
                  onClick={() => revokeInvitation(invitation.id)}
                  />
              </td>
            </tr>
          ) }

          { membershipRequests.length > 0 &&
            <tr>
              <td colSpan={2}><b>Requests to Join</b></td>
            </tr>
          }
          { membershipRequests.map(membershipRequest =>
            <tr key={membershipRequest.id}>
              <td><UserIconWithName user={membershipRequest.user} /></td>
              <td>
                <ButtonGroup>
                  <Button
                    text="Accept"
                    intent="success"
                    icon="add"
                    onClick={() => this.acceptMembershipRequest(membershipRequest.id)}
                    />
                  <Button
                    text="Decline"
                    intent="danger"
                    icon="trash"
                    onClick={() => declineMembershipRequest(membershipRequest.id)}
                    />
                </ButtonGroup>
              </td>
            </tr>
            )}
        </tbody>
      </HTMLTable>
    </div>
  }


  async acceptMembershipRequest(id) {
    const { client } = this.props
    const mutation = gql`
      mutation ($id: ID!) {
        acceptMembershipRequest(id: $id) {
          id
          status
          project {
            id
            membershipRequests(status: "pending") {
              id
              status
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
          }
        }
      }
    `
    const variables = { id }
    await client.mutate({ mutation, variables })
  }
}

MembersList.propTypes = {
  projectDomain: PropTypes.string.isRequired,
  canAssignRole: PropTypes.bool,
}

export default compose(
  actionsConnect({openModal}),
  withApollo,
)(MembersList)
