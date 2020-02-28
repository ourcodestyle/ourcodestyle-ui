import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import App from './App'

import { ApolloProvider } from "react-apollo"

class Root extends Component {
  render() {
    return <Provider store={this.props.store}>
            <ConnectedRouter history={this.props.history}>
              <ApolloProvider client={this.props.apolloClient}>
                <App actionCable={this.props.actionCable} />
              </ApolloProvider>
            </ConnectedRouter>
          </Provider>
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  apolloClient: PropTypes.object.isRequired,
  actionCable: PropTypes.object.isRequired,
}

export default Root
