import { Map } from 'immutable'

import { runReducers } from '~/utils/reducers'

import * as actions from './actions'
import initialState from './initialState'

const setAudience = (state, { ruleId, presenceList }) => {
  return state.setIn([ruleId, 'presenceList'], presenceList)
}

const reducers = {
  [actions.setAudience]: setAudience
}

export default (state = initialState, action) => {
  return runReducers(reducers, action)(state)
}

