import { Set } from 'immutable'
import {
  runReducers,
  composeReducers,
  runReducer,
  watchRequest,
} from '~/utils/reducers'
import {AsyncState} from '~/redux/globalModels'

import * as actions from './actions'
import initialState from './initialState'


const fieldChange = (state, { path, value }) => {
  return state.setIn(path, value)
}

const setCategoryIds = (state, {categoryIds}) => {
  return state.set('categoryIds', categoryIds)
}

const expandAll = (state) => {
  return state.set('expandedCategories', new Set(state.get('categoryIds')))
}

const collapseAll = (state) => {
  return state.set('expandedCategories', new Set())
}

const expandCategory = (state, {categoryId}) => {
  return state.updateIn(['expandedCategories'], expandedCategories => expandedCategories.add(categoryId))
}

const collapseCategory = (state, {categoryId}) => {
  return state.updateIn(['expandedCategories'], expandedCategories => expandedCategories.remove(categoryId))
}

const setFilter = (state, {filterValue}) => {
  let newState = state
  if (state.get('filterValue').length == 0 && filterValue.length > 0) {
    newState = expandAll(state)
  }
  return newState.set('filterValue', filterValue)
}

const reducers = {
  [actions.setCategoryIds]: setCategoryIds,
  [actions.expandCategory]: expandCategory,
  [actions.collapseCategory]: collapseCategory,
  [actions.fieldChange]: fieldChange,
  [actions.expandAll]: expandAll,
  [actions.collapseAll]: collapseAll,
  [actions.setFilter]: setFilter,
  [actions.generateConfigFile.request]: (state) => state.setIn(['asyncState', 'generateConfigFile'], AsyncState.request),
  [actions.generateConfigFile.success]: (state) => state.setIn(['asyncState', 'generateConfigFile'], AsyncState.success),
  [actions.generateConfigFile.failure]: (state) => state.setIn(['asyncState', 'generateConfigFile'], AsyncState.failure),
}

export default (state = initialState, action) => {
  return runReducers(reducers, action)(state)
}

