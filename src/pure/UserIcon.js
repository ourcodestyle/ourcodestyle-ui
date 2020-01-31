import React from 'react'
import PropTypes from 'prop-types'

const UserIcon = ({href, user, style}) => {
  // const {id, name, pictureUrl, nickname} = user
  href = href || (user && user.pictureUrl)
  return <div className="user-icon" style={ style || {display: 'inline-block'}}>
    <img src={href} />
  </div>
}

UserIcon.propTypes = {
  href: PropTypes.string.isRequired
}

export default UserIcon