import {
  getContext,
  put,
  call,
} from 'redux-saga/effects'
import gql from 'graphql-tag'

import {
  watchLatest,
} from '~/utils/sagas'
import { AppToaster } from '~/components/toaster'
import * as actions from './actions'

import {delay} from '~/utils/sagas'
import StyleGuideGQL from '../styleGuide.gql'

function* generateConfigFile({styleGuideId}) {
  yield put(actions.generateConfigFile.request({styleGuideId}))

  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation ($styleGuideId: ID!) {
      generateConfigFile(styleGuideId: $styleGuideId) {
        id
        styleGuide {
          id
          configFile {
            id
            updatedAt
            url
          }
        }
      }
    }
  `

  const variables = {styleGuideId}

  try {
    yield call(apolloClient.mutate, { mutation, variables })
    yield put(actions.generateConfigFile.success({ styleGuideId, response: {} }))
    AppToaster.show({ message: "Generated RuboCop config", intent: 'success'})
  } catch(error) {
    yield put(actions.generateConfigFile.failure({ styleGuideId, error }))
  }
}

function* checkPopulatingComplete({styleGuideId}){
  yield delay(5000)

  const variables = {id: styleGuideId}
  const query = gql(StyleGuideGQL)
  const apolloClient = yield getContext('apolloClient')
  const response = yield call(apolloClient.query, {query, variables, fetchPolicy: "network-only"})

  if (!response.data.styleGuide.isRulesPopulated){
    yield put(actions.checkPopulatingComplete({styleGuideId}))
  }
}

export default function* root() {
  yield watchLatest({
    [actions.generateConfigFile]: generateConfigFile,
    [actions.checkPopulatingComplete]: checkPopulatingComplete,
  })
}
