import {
  namespace,
  createAction,
  createRequestActions
} from '~/utils/actions'

const ns = namespace('global')

export const openModal = createAction(ns('openModal'), ['modalName', 'modalProps'], { defaults: { modalProps: {} } })
export const closeModal = createAction(ns('closeModal'))

export const cloneStyleGuide = createRequestActions(ns('cloneStyleGuide'), ['styleGuideId', 'organizationId'])

export const mutationSuccess = createAction(ns('mutationSuccess'), ['action', 'data'])
export const like = createAction(ns('like'), ['likeableType', 'likeableId', 'likesCount'])
export const unlike = createAction(ns('unlike'), ['likeableType', 'likeableId', 'likesCount'])

export const showUser = createAction(ns('showUser'), ['user'])