export const policy = (user, record) => {

  const organization = {
    canAssignRole: () => _.chain(user.memberships).
                          filter({role: 'admin'}).
                          map('organization.id').
                          includes(record.id).
                          value(),
    canInviteMembers: () => _.chain(user.memberships).
                          filter({role: 'admin'}).
                          map('organization.id').
                          includes(record.id).
                          value(),
  }

  return {
    organization
  }
}

export const getOrganizations = (user) => {

}