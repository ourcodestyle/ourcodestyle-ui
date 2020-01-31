import { select, getContext, call } from 'redux-saga/effects'
import gql from 'graphql-tag'
import {
  watchLatest,
  runRequest
} from '~/utils/sagas'
import { AppToaster } from '~/components/toaster'

import api from '~/api'
import * as actions from './actions'

function* create() {
  const params = yield select(({ Organizations }) => Organizations.get('newOrganization').toJS())
  const onFailure = (error) => {
    AppToaster.show({ message: error.errorText, intent: 'danger'})
  }
  yield runRequest(actions.create, [api.organizations.create, params], {onFailure})
}

function* removeMembership({id}) {
  const apolloClient = yield getContext('apolloClient')

  const mutation = gql`
    mutation($id: ID!) {
      removeMembership(id: $id) {
        organization {
          id
          memberships {
            id
          }
        }
      }
    }
  `
  const variables = { id }

  try {
    yield call(apolloClient.mutate, { mutation, variables })
  } catch(error){
    console.log(error)
  }
}


export default function* root() {
  yield watchLatest({
    [actions.create]: create,
    [actions.removeMembership]: removeMembership,
  })
}