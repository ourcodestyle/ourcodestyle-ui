import _ from 'lodash'

export const policy = (user, record) => {
  const isOrganizationAdmin = organizationId =>
    _.chain(user.memberships).
    filter({role: 'admin'}).
    map('organization.id').
    includes(organizationId).
    value()

  const organization = {
    canAssignRole: () => isOrganizationAdmin(record.id),
    canInviteMembers: () => isOrganizationAdmin(record.id),
  }

  return {
    organization
  }
}

