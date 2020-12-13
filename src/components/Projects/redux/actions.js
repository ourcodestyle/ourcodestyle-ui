import {
  namespace,
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('Projects')

export const fieldChange = createAction(ns('fieldChange'), ['path', 'value'])

export const create = createRequestActions(ns('create'))

export const removeMembership = createRequestActions(ns('removeMembership'), ['id'])
