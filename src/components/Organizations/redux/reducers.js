import { Map } from 'immutable'

import { runReducers } from '~/utils/reducers'

import * as actions from './actions'
import initialState from './initialState'

const fieldChange = (state, { path, value }) => {
  return state.setIn(path, value)
}

const reducers = {
  [actions.fieldChange]: fieldChange
}

export default (state = initialState, action) => {
  return runReducers(reducers, action)(state)
}

