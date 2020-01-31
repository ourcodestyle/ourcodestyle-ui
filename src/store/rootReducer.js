import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import globalReducers from '~/redux/globalReducers'
import requestState from '~/requestState/reducer'
import SignUpPage from '~/components/SignUpPage/redux/reducers'
import Organizations from '~/components/Organizations/redux/reducers'
import StyleGuides from '~/components/StyleGuides/redux/reducers'
import Rules from '~/components/Rules/redux/reducers'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  global: globalReducers,
  requestState,
  SignUpPage,
  Organizations,
  StyleGuides,
  Rules,
})

export default createRootReducer
