import {createStore, compose, applyMiddleware} from 'redux'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'

import createRootReducer from './rootReducer'
import runSagas from './runSagas'

export const history = createBrowserHistory()

function configureStoreProd({initialState, apolloClient}) {
  const sagaMiddleware = createSagaMiddleware({
    context: {
      apolloClient
    }
  })
  const middlewares = [
    // Add other middleware on this line...
    sagaMiddleware,
    routerMiddleware(history) // for dispatching history actions
  ]

  const store = createStore(
    createRootReducer(history),
    initialState,
    compose(
      applyMiddleware(...middlewares)
    )
  )

  runSagas(sagaMiddleware)

  return store
}

function configureStoreDev({initialState, apolloClient}) {
  const sagaMiddleware = createSagaMiddleware({
    context: {
      apolloClient
    }
  })

  const middlewares = [
    // Add other middleware on this line...

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),
    sagaMiddleware,
    routerMiddleware(history) // for dispatching history actions
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // add support for Redux dev tools
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(...middlewares)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducer', () => {
      const nextReducer = require('./rootReducer').default // eslint-disable-line global-require
      store.replaceReducer(nextReducer)
    })
  }

  runSagas(sagaMiddleware)

  return store
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev

export default configureStore
