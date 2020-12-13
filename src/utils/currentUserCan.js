import _ from 'lodash'

const currentUserCan = (currentUser) => (assets) => (action, record) => {
    const {
      project,
      styleGuide,
    } = assets

    let isAdmin = false
    let isMember = false
    let isCreator = false

    let projectId
    if (project) {
      projectId = project.id
    } else if (styleGuide) {
      projectId = styleGuide.projectId
    }

    if (projectId) {
      const hasRole = role =>
        _.includes(
          _.map(_.filter(currentUser.memberships, {role}), m => parseInt(m.project.id)),
          parseInt(projectId)
        )
      isAdmin = hasRole('admin')
      isMember = hasRole('user')
    }

    if (record && record.createdByUserId) {
      isCreator = record.createdByUserId === currentUser.id
    }

    switch (action) {
      case "edit":
        return isAdmin || isCreator
      case "addStyleGuide":
        return isAdmin || isMember
      case "suggest":
        return isAdmin || isMember
      case "deleteComment":
        return isAdmin || isCreator
      default:
        return isAdmin
    }
}

export default currentUserCan
