import {USER} from '~/gql/fragments'

export const PROJECT_MEMBERS = `
  query readProject($domain: String!){
    project(domain: $domain){
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
