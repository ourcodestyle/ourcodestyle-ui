/* eslint-disable import/no-named-as-default */
import React from 'react'
import _ from 'lodash'
import Routes from './Routes'

import {CurrentUserContext} from '~/contexts'
import { ActionCableContext } from '~/contexts/actionCable'
import QueryComponent from "~/fuks/QueryComponent"

import { FocusStyleManager } from "@blueprintjs/core"
FocusStyleManager.onlyShowFocusOnTabs()

import {
  USER,
  ORGANIZATION,
} from '~/gql/fragments'

export const PROFILE_QUERY = `
  query currentUser {
    user(id: "me") {
      ... USER
      memberships {
        id
        role
        organization {
          ... ORGANIZATION
          styleGuides {
            id
            name
            linter
            language
          }
        }
      }
      membershipRequests {
        id
        organizationId
        status
      }
    }
  }
  ${USER}
  ${ORGANIZATION}
`

class App extends QueryComponent {
  query(){
    return PROFILE_QUERY
  }

  queryLoaded({user}){
    this.setState({ user: { ...user, isGuest: _.isEmpty(user.id) } })
  }

  queryFailed({error}) {
    this.setState({loading: false, error})
  }

  content() {
    const location = this.props
    return <div id="main-container">
      <CurrentUserContext.Provider value={this.state.user}>
        <ActionCableContext.Provider value={this.props.actionCable}>
          <Routes location={location} />
        </ActionCableContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  }
}

export default App
