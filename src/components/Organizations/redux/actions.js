import {
  namespace,
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('Organizations')

export const fieldChange = createAction(ns('fieldChange'), ['path', 'value'])

export const create = createRequestActions(ns('create'))

export const removeMembership = createRequestActions(ns('removeMembership'), ['id'])