import {
  namespace,
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('Dialogs')

export const fieldChange = createAction(ns('fieldChange'), ['path', 'value'])

export const create = createRequestActions(ns('create'))