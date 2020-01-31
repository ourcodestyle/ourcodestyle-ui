import React from 'react'

import { withRouter } from 'react-router-dom'

export default (Component) => {
  const WithRouterComponent =  withRouter(Component)
  
  const redirectTo = (path) => {
    this.props.history.push(path)
  }

  return props => <WithRouterComponent redirectTo={redirectTo} {...props} />
}

