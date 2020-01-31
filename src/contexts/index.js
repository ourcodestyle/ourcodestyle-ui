import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import currentUserCan from '~/utils/currentUserCan'

// withCurrentUser
export const CurrentUserContext = React.createContext({})
// This function takes a component...
export function withCurrentUser(Component) {
  // ...and returns another component...
  return function ComponentWithCurrentUser(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well

    const buildCurrentUserCan = (currentUser) => {
      return currentUserCan(currentUser)
    }

    return (
      <CurrentUserContext.Consumer>
        {currentUser => <Component {...props} currentUser={currentUser} currentUserCan={buildCurrentUserCan(currentUser)}  />}
      </CurrentUserContext.Consumer>
    )
  }
}
// end: withCurrentUser

// withForm
export const FormContext = React.createContext()
FormContext.displayName = "FormContext"

export function withForm(Component) {
  return function ComponentWithForm(props) {
    return (
      <FormContext.Consumer>
        {(contextProps) => {
          return <Component {...contextProps} {...props} />
        }
      }
      </FormContext.Consumer>
    )
  }
}

// end: withForm

// withRouter
export const withRouting = (Component) => {
  const ComponentWithRouter = (props) => {
    const redirectTo = (path) => () => props.push(path)
    return <Component redirectTo={redirectTo} {...props} />
  }
  ComponentWithRouter.propTypes = {
    push: PropTypes.func.isRequired
  }
  return connect(null, { push })(ComponentWithRouter)
}
// end: withRouter
