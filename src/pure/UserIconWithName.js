import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const UserIconWithName = ({user}) => {
  const {id, name, pictureUrl, nickname} = user
  return <div style={{display: 'inline-block' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr' }}>
    <div className="user-icon size-small">
      <img src={pictureUrl} alt={name} title={name} />
    </div>
    <div>
      <Link to={`/users/${nickname}`}>{name}</Link>
    </div>
  </div>
  </div>
}

UserIconWithName.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserIconWithName