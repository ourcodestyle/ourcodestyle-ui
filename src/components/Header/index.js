import React from 'react'

import {
  Switch,
  NavLink,
  Link,
  Route,
} from 'react-router-dom'

import { push } from 'connected-react-router'

import { withApollo } from 'react-apollo'
import { compose } from 'redux'

import {
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
  Icon,
  Navbar,
  Alignment,
  Classes
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import UserIcon from '~/pure/UserIcon'

import { fConnect } from '~/utils/components'
import { openModal } from '~/redux/globalActions'
import { withCurrentUser } from '~/contexts'
import Storage from '~/services/storage'

class Header extends React.Component {

  render(){
    const { currentUser, actions } = this.props

    const { openModal, client } = this.props.actions
    const redirectTo = (location) => () => {
      console.log('lets go %s', location)
      console.dir(actions.push(location))
    }
    const signOut = () => {
      Storage.remove('userToken')
      client.resetStore()
      push('/')
    }

    const menu = (
      <Menu>
        <MenuItem icon="mugshot" onClick={redirectTo(`/users/${currentUser.nickname}`)} text="Your Profile" />
        <MenuDivider />
        <MenuItem icon="log-out" text="Sign out" onClick={signOut} />
      </Menu>
    )

    const target = (
      <Button className={Classes.MINIMAL}>
      <div className="user-profile-dropdown" style={{ lineHeight: "30px" }}>
        <UserIcon href={currentUser.pictureUrl} style={{ width: '30px', height: '30px' }} />
        <div style={{ display: 'inline' }}>{currentUser.name}</div>
        <Icon icon={IconNames.CARET_DOWN} style={{ marginTop: 6, marginLeft: 6 }} />
      </div>
    </Button>
    )

    return (
      <Navbar style={{marginTop: 10}}>
        <Navbar.Group align={Alignment.LEFT}>
          <div className="pt-navbar-heading">
            <NavLink exact to="/">
              <img src="/images/logo.png" className="logo" />
            </NavLink>
          </div>
        </Navbar.Group>

        <Navbar.Group align={Alignment.RIGHT}>
          { currentUser.id ?
            <div>
              <Popover content={menu} position={Position.BOTTOM} target={target} usePortal={false} />
            </div>
            :
            <Button icon={IconNames.USER} onClick={redirectTo("/auth/github")}>
              Sign in with GitHub
            </Button>
          }
        </Navbar.Group>
      </Navbar>
    )
  }

}

export default compose(
  fConnect({openModal, push}),
  withCurrentUser,
  withApollo
)(Header)
