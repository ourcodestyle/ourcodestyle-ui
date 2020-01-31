import {
  namespace,
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('StyleGuides')

export const fieldChange = createAction(ns('fieldChange'), ['path', 'value'])

export const create = createRequestActions(ns('create'))

export const expandCategory = createAction(ns('expandCategory'), ['categoryId'])
export const collapseCategory = createAction(ns('collapseCategory'), ['categoryId'])
export const expandAll = createAction(ns('expandAll'))
export const collapseAll = createAction(ns('collapseAll'))
export const setCategoryIds = createAction(ns('setCategoryIds'), ['categoryIds'])
export const setFilter = createAction(ns('setFilter'), 'filterValue')

export const generateConfigFile = createRequestActions(ns('generateConfigFile'), ['styleGuideId'])
export const checkPopulatingComplete = createAction(ns('checkPopulatingComplete'), ['styleGuideId'])