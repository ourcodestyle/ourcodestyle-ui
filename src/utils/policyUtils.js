import _ from 'lodash'

export const canEditProject = (currentUser, projectId) => {
  return _.some(currentUser.memberships, (m) => {
    return m.project.id === projectId && m.role === 'admin'
  })
}

export const canSuggest = (currentUser, projectId) => {
  return _.some(currentUser.memberships, ({role, project}) => {
    return project.id === projectId && _.includes(['admin', 'member'], role)
  })
}
