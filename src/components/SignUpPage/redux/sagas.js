import {all, takeLatest} from 'redux-saga/effects'

import * as actions from './actions'

function* watchSubmit() {
  yield takeLatest(actions.submit.init, () => console.log('init of submit'))
}

export default function* root() {
  yield all([
    watchSubmit()
  ])
}