import {
  Map,
  List
} from 'immutable'

const initialState = new Map({
  currentUser: {
    isLoading: true
  },
  currentAccount: null,
  fetchComplete: false,
  asyncState: new Map(),
  models: new Map({
    organization: new List([])
  }),
  openedModal: "",
  modalProps: {}
})

export default initialState