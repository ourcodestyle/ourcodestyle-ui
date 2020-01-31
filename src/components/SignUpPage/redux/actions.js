import { 
  namespace,  
  createAction,
  createRequestActions,
} from '~/utils/actions'

const ns = namespace('SignUpPage')

export const fieldChange = createAction(ns('fieldChange'), ['name', 'value'])

export const submit = createRequestActions(ns('submit'))