import { Map } from 'immutable'
import _ from 'lodash'

import { AsyncState } from '~/redux/globalModels'
const initialState = new Map()

export default function reducer(state = initialState, action) {

  const parts = _.split(action.type, '.')
  // const requestName = _.slice(parts, 0, parts.length - 1).join('.')
  const requestState = parts[parts.length - 1]

  if ( action.requestId && _.includes(['init', 'request', 'success', 'failure'], requestState) ) {
    state = state.set(action.requestId, AsyncState[requestState])
  }

  return state
}
