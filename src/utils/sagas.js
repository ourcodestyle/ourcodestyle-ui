import { 
  all,
  takeLatest, 
  takeEvery,
  call, 
  put 
} from 'redux-saga/effects'
import _ from 'lodash'
import uuidv1 from 'uuid/v1'
// import { getErrorText } from '~/utils/api'
const getErrorText = (error) => {
  if (error && error.response && error.response.data){
    return error.response.data.error_message
  } else if (error.message) {
    return error.message
  } else {
    return String(error)
  }
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const isResponseSuccess = (response) => {
  if (response.name == 'Error') {
    return false
  }
  return response.status.toString().split('')[0] == 2 || response.status == 304
}

export const watchLatest = (events) => all(_.reduce(events, // collection
  (result, saga, action) => result.concat([takeLatest(action, saga)]), // iteratee
  []))     // accumulator

export const watchEvery = (events) => all(_.reduce(events, // collection
  (result, saga, action) => result.concat([takeEvery(action, saga)]), // iteratee
  []))     // accumulator

//
// Writing:
//
//      runRequest(actions.deleteUser, [UserAPI.deleteUser, userId])
//
// is same as:
//
//      yield put(actions.deleteUser.request())
//      try {
//        const response = yield call(UserAPI.deleteUser, userId)
//        if (isResponseSuccess(response)) {
//          yield put(actions.deleteUser.success())
//        } else {
//          throw(response)
//        }
//      } catch (error) {
//        yield put(actions.deleteUser.failure(error))
//        console.dir(error)
//      }
//
//
//  Also you can use onSuccess, onFailure hooks to handle specific actions like showing toastr message, like
//
//    const onSuccess = () => toastr.success("User was deleted")
//    const onFailure = (error) => toastr.failure("Something went wrong: " + error.errorText)
//    runRequest(actions.deleteUser, [UserAPI.deleteUser, userId], { onSuccess, onFailure })
//

export function* runRequest(actions, requestFnWithArgs, { onSuccess, onFailure, payload } = {}) {

  if (!_.isArray(requestFnWithArgs)) {
    if (typeof(requestFnWithArgs) != 'function'){
      throw `runRequest expected a function for requestFnWithArgs, but got: ${requestFnWithArgs}`
    }
    requestFnWithArgs = [requestFnWithArgs]
  }  

  const requestId = uuidv1()
  const params = requestFnWithArgs.slice(1)

  let response = null
  try {
    if (!_.isArray(requestFnWithArgs)) {
      requestFnWithArgs = [requestFnWithArgs]
    }

    yield put(actions.request({ requestId, params, ...payload }))

    response = yield call(...requestFnWithArgs)
    if (isResponseSuccess(response)) {
      const responseResult = { data: response.data, headers: response.headers }
      yield put(actions.success({ response: responseResult, requestId, params, ...payload }))
      onSuccess && onSuccess(response)
    } else {
      throw (response)
    }
  } catch (error) {
    error.errorText = getErrorText(error)
    error.response = response
    console.dir(error)
    yield put(actions.failure({error, requestId, params, ...payload }))
    onFailure && onFailure(error)
  }
}
