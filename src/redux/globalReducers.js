import { Map } from 'immutable'

import * as globalActions from './globalActions'
import initialState from './initialState'

export default function globalReducer(state = initialState, action) {

  const reducers = new Map({
    [globalActions.openModal]: () => state.set('openedModal', action.modalName).set('modalProps', action.modalProps || {}),
    [globalActions.closeModal]: () => state.set('openedModal', "")
  })

  return reducers.get(action.type, () => state)()
}
