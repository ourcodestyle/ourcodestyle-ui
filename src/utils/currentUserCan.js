import _ from 'lodash'

const currentUserCan = (currentUser) => (assets) => (action, record) => {
    const {
      organization,
      styleGuide,
    } = assets

    const isGuest = !currentUser.id
    let isAdmin = false
    let isMember = false
    let isCreator = false

    let organizationId
    if (organization) {
      organizationId = organization.id
    } else if (styleGuide) {
      organizationId = styleGuide.organizationId
    }

    if (organizationId) {
      isAdmin = _.includes(_.map(_.filter(currentUser.memberships, {role: 'admin'}), (m) => parseInt(m.organization.id) ), parseInt(organizationId))
      isMember = _.includes(_.map(_.filter(currentUser.memberships, {role: 'user'}), (m) => parseInt(m.organization.id) ), parseInt(organizationId))
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
