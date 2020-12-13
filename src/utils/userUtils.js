import _ from 'lodash'

export const policy = (user, record) => {
  const isProjectAdmin = projectId =>
    _.chain(user.memberships).
    filter({role: 'admin'}).
    map('project.id').
    includes(projectId).
    value()

  const project = {
    canAssignRole: () => isProjectAdmin(record.id),
    canInviteMembers: () => isProjectAdmin(record.id),
  }

  return {
    project
  }
}

