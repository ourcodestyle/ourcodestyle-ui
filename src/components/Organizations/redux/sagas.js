import { select, getContext, call } from 'redux-saga/effects'
import gql from 'graphql-tag'
import {
  watchLatest,
} from '~/utils/sagas'

import * as actions from './actions'

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
    [actions.removeMembership]: removeMembership,
  })
}
