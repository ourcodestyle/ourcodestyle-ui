import _ from 'lodash'

export const canEditOrganization = (currentUser, organizationId) => {
  return _.some(currentUser.memberships, (m) => {
    return m.organization.id === organizationId && m.role === 'admin'
  })
}

export const canSuggest = (currentUser, organizationId) => {
  return _.some(currentUser.memberships, ({role, organization}) => {
    return organization.id === organizationId && _.includes(['admin', 'member'], role)
  })
}