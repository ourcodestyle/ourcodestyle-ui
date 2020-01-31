import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  Tooltip
} from '@blueprintjs/core'

const UserAvatar = ({user: {pictureUrl, name, nickname}, style}) => {

  return <div className="user-icon size-small" style={style}>
    <Link to={`/users/${nickname}`} title={name}>
      <Tooltip content={`${name} @${nickname}`} style={{zIndex: 205, position: 'absolute'}}>
        <img src={pictureUrl} alt={name} title={name} />
      </Tooltip>
    </Link>
  </div>
}

UserAvatar.propTypes = {
  user: PropTypes.object.isRequired,
}

export default UserAvatar
