import { List, Record } from 'immutable'

export const AsyncState = {
  init:    { init:    true, pending: false, complete: false },
  request: { request: true, pending: true,  complete: false },
  success: { success: true, pending: false, complete: true  },
  failure: { failure: true, pending: false, complete: true  },
}

export const Organization = Record({
  id: "",
  name: "",
  domain: "",
  styleGuides: new List(),
  isLoading: true,
  isDeleted: false,
}, 'Organization')
