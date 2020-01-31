import {USER} from '~/gql/fragments'

export const ORGANIZATION_MEMBERS = `
  query readOrganization($domain: String!){
    organization(domain: $domain){
      id
      createdByUserId
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
      personalInvitations(status: "pending") {
        id
        nickname
        status
      }
      membershipRequests(status: "pending") {
        id
        status
        user {
          ...USER
        }
      }
    }
  }
  ${USER}
`