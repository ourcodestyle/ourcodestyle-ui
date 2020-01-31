import {
  reduce,
  each,
  curry
} from 'lodash'
import { Map } from 'immutable'

import { AsyncState } from '~/redux/globalModels'

export const runReducers = (reducers, action) => state => {
  if (action && reducers[action.type]) {
    return reducers[action.type](state, action)
  }
  return state
}

const reducerRunner = (reducers, action, state) => {
  if (action && reducers[action.type]) {
    return reducers[action.type](state, action);
  }

  return state
}

/**
 * requestWatcher - unify storing of current async state of the request
 *
 * Adding into reducer line like:
 *
 *    state = watchRequest({
 *      fetchSettings: actions.fetchSettings
 *    }, action, state)
 *
 * Is same if you would add such into reducer:
 *
 * [actions.fetchSettings.init]:    () => state.setIn(['asyncState', 'fetchSettings'], AsyncState.init),
 * [actions.fetchSettings.request]: () => state.setIn(['asyncState', 'fetchSettings'], AsyncState.request),
 * [actions.fetchSettings.success]: () => state.setIn(['asyncState', 'fetchSettings'], AsyncState.success),
 * [actions.fetchSettings.failure]: () => state.setIn(['asyncState', 'fetchSettings'], AsyncState.failure),
 *
 * And if decoupling further, writing:
 *
 * [actions.fetchSettings.success]: () => state.setIn(['asyncState', 'fetchSettings'], AsyncState.success)
 *
 * Is same as:
 *
 * [actions.fetchSettings.success]: () => state.setIn(
 *    ['asyncState', 'fetchSettings'], { success: true, pending: false, complete: true }
 * )
 *
 * You can still catch same actions in your reducers if need some specific logic
 */

const requestWatcher = (requests, action, state) => {
  if (!state.get('asyncState')) {
    // Just set for each key the initial state
    // Would produce map like:
    // new Map({ fetchPost: AsyncState.init, fetchUser: AsyncState.init })
    const asyncState = reduce(
      Object.keys(requests),
      (m, key) => m.set(key, AsyncState.init),
      new Map({})
    )
    state = state.set('asyncState', asyncState)
  }

  let reduceSettings = null
  each(requests, (a, namespace) => {
    each(['init', 'request', 'success', 'failure'], (requestStep) => {
      if (a[requestStep] == action.type) {
        reduceSettings = { namespace, requestStep }
      }
    })
  })

  if (reduceSettings) {
    const { namespace, requestStep } = reduceSettings
    state = state.setIn(['asyncState', namespace], AsyncState[requestStep])
  }

  return state
}

export const runReducer = curry(reducerRunner)
export const watchRequest = curry(requestWatcher)

export function composeReducers(...reducers) {
  return (state, action) => {
    return reducers.reduce((result, reducer) => reducer(result, action), state)
  }
}
