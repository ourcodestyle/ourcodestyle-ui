import {
  namespace,
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('Rules')

export const vote = createRequestActions(ns('vote'), ['ruleId', 'paramId', 'optionId', 'intent', 'allowMultipleValues'])
export const unvote = createRequestActions(ns('unvote'), ['ruleId', 'paramId', 'optionId', 'voteId'])

export const deleteRule = createRequestActions(ns('deleteRule'), ['id'])
export const deleteParam = createRequestActions(ns('deleteParam'), ['id'])
export const deleteOption = createRequestActions(ns('deleteOption'), ['id'])

export const deleteComment = createRequestActions(ns('deleteComment'), ['id'])
export const voted = createAction(ns('voted'), ['vote'])
export const unvoted = createAction(ns('unvoted'), ['vote'])

export const setAudience = createAction(ns('setAudience'), ['ruleId', 'presenceList'])
