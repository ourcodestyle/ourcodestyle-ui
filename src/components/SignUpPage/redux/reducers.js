import { Map } from 'immutable'

import { runReducers } from '~/utils/reducers'

import * as actions from './actions'

const initialState = new Map({
  companyName: "Fuksito Inc.",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: ""
})

const fieldChange = (state, {name, value}) => {
  return state.set(name, value)
}

const submit = (state) => {
  return state
}

const reducers = {
  [actions.fieldChange]: fieldChange,
  [actions.submit.success]: submit
}

export default (state = initialState, action) => { 
  return runReducers(reducers, action)(state)
}

