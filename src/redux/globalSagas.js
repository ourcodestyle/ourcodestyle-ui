/* eslint-disable require-yield */
import 'babel-polyfill'
import { call, put, getContext } from 'redux-saga/effects'
import uuidv1 from 'uuid/v1'
import { push } from 'connected-react-router'

import {
  watchLatest,
  runRequest
} from '~/utils/sagas'
import { Intent } from '@blueprintjs/core'
import Api from '~/api'
import Storage from '~/services/storage'
import { AppToaster } from '~/components/toaster'
import * as globalActions from '~/redux/globalActions'
import gql from 'graphql-tag'

function* like({likeableType, likeableId, likesCount}) {
  const apolloClient = yield getContext('apolloClient')

  const mutation = gql`
    mutation($likeableType: String!, $likeableId: ID!){
      like(likeableType: $likeableType, likeableId: $likeableId){
        ... on ${likeableType} {
          id
          likesCount
          myLikes: likes(userId: "me") {
            id
          }
        }
      }
    }
  `
  const variables = { likeableType, likeableId }

  const optimisticResponse = {
    __typename: 'Mutation',
    like: {
      __typename: likeableType,
      id: likeableId,
      likesCount: likesCount + 1,
      myLikes: [{
        id: Math.round(Math.random() * -1000000),
        __typename: "Like",
      }],
    },
  }

  try {
    yield call(apolloClient.mutate, { mutation, variables, optimisticResponse })
  } catch(error){
    console.log(error)
  }
}

function* unlike({likeableType, likeableId, likesCount}) {
  const apolloClient = yield getContext('apolloClient')

  const mutation = gql`
    mutation($likeableType: String!, $likeableId: ID!) {
      unlike(likeableType: $likeableType, likeableId: $likeableId){
        ... on ${likeableType} {
          id
          likesCount
          myLikes: likes(userId: "me") {
            id
          }
        }
      }
    }
  `
  const variables = { likeableType, likeableId }

  const optimisticResponse = {
    __typename: 'Mutation',
    unlike: {
      __typename: likeableType,
      id: likeableId,
      likesCount: likesCount - 1,
      myLikes: [],
    },
  }

  try {
    yield call(apolloClient.mutate, { mutation, variables, optimisticResponse })
  } catch(error){
    console.log(error)
  }
}

function* showUser({user}) {
  const message = `User ${user.nickname} appeared!`
  AppToaster.show({ message  })
}

export default function* root() {
  yield watchLatest({
    [globalActions.like]: like,
    [globalActions.unlike]: unlike,
    [globalActions.showUser]: showUser,
  })
}
