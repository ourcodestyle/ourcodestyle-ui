import { call, put, select, getContext } from 'redux-saga/effects'
import { push } from 'connected-react-router'

import _ from 'lodash'
import {
  watchLatest,
  runRequest
} from '~/utils/sagas'
import { AppToaster } from '~/components/toaster'
import { Intent } from '@blueprintjs/core'

import gql from 'graphql-tag'
import * as actions from './actions'

import { parseErrorMessage } from '~/utils/apiUtils'

import RULE_GQL from '../rule.gql'
import {
  VOTE,
  USER,
} from '~/gql/fragments'
import {PROFILE_QUERY} from '~/components/App.js'

function* vote({ruleId, paramId, optionId, intent, allowMultipleValues}) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation vote($optionId: ID!, $intent: Intent) {
      vote(optionId: $optionId, intent: $intent) {
        ... VOTE
        param {
          id
          options {
            id
            hasConsensus
          }
        }
      }
    }
    ${VOTE}
    ${USER}
  `

  const variables = {optionId, intent}

  const currentUser = apolloClient.store.cache.readQuery({query: gql(PROFILE_QUERY)}).user
  const userCacheId = apolloClient.store.cache.config.dataIdFromObject(currentUser)
  const user = apolloClient.store.cache.readFragment({
    id: userCacheId,
    fragment: gql(USER)
  })
  const userId = user.id

  const optimisticResponse = {
    __typename: 'Mutation',
    vote: {
      __typename: 'Vote',
      id: Math.round(Math.random() * -1000000),
      intent,
      userId,
      ruleId,
      paramId,
      optionId,
      user,
    },
  }

  // const vote = yield new Promise(resolve => {
    apolloClient.mutate({
      mutation,
      variables,
      optimisticResponse,
      update: (store, { data: { vote } }) => {
        addVote({ apolloClient, vote, allowMultipleValues })
      }
    })
  // })
  // yield put(actions.voted({vote}))
}

function* unvote({ruleId, paramId, intent, voteId}) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation unvote($voteId: ID!) {
      unvote(voteId: $voteId) {
        ... VOTE
      }
    }
    ${VOTE}
    ${USER}
  `
  const variables = {voteId}
  const currentUser = apolloClient.store.cache.readQuery({query: gql(PROFILE_QUERY)}).user
  const userCacheId = apolloClient.store.cache.config.dataIdFromObject(currentUser)
  const user = apolloClient.store.cache.readFragment({
    id: userCacheId,
    fragment: gql(USER)
  })
  const userId = user.id
  const optimisticResponse = {
    __typename: 'Mutation',
    unvote: {
      __typename: 'Vote',
      id: voteId,
      intent,
      userId,
      ruleId,
      paramId,
      optionId: null,
      user,
    },
  }

  apolloClient.mutate({ mutation, variables, optimisticResponse })
}

function addVote({apolloClient, vote, allowMultipleValues}) {
  const cache = apolloClient.store.cache
  const query = gql(RULE_GQL)
  const variables = { id: vote.ruleId }
  let data = cache.readQuery({ query, variables })
  const votes = data.rule.votes

  const replaceVote = () => {
    const index = _.findIndex(votes, _.pick(vote, ['userId', 'paramId']))
    if (index > -1) {
      data.rule.votes[index] = vote
    } else {
      data.rule.votes = data.rule.votes.concat([vote])
    }
  }

  const appendVote = () => {
    const index = _.findIndex(votes, _.pick(vote, ['userId', 'paramId', 'optionId']))
    if (index > -1) {
      data.rule.votes[index] = vote
    } else {
      data.rule.votes = data.rule.votes.concat([vote])
    }
  }

  if (allowMultipleValues) {
    appendVote()
  } else {
    replaceVote()
  }

  cache.writeQuery({ query, variables, data })
}

function* voted({vote}) {
  const apolloClient = yield getContext('apolloClient')
  // console.log('saga voted', {apolloClient, vote})
  // yield call(addVote, {apolloClient, vote})

  const cache = apolloClient.store.cache
  const query = gql(RULE_GQL)
  const variables = { id: vote.ruleId }
  let data = cache.readQuery({ query, variables })
  let index = _.findIndex(data.rule.votes, { userId: vote.userId, ruleOptionId: vote.ruleOptionId })
  console.log('index = %s', index)
  if (index > -1) {
    data.rule.votes[index] = vote
  } else {
    data.rule.votes = data.rule.votes.concat([vote])
    console.log('adding a vote', data.rule.votes)
  }

  cache.writeQuery({ query, variables, data })
  apolloClient.queryManager.broadcastQueries()
}

function* deleteOption({ id }) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation ($id: ID!){
      deleteOption(id: $id) {
        id
        option {
          id
          rule {
            id
          }
        }
      }
    }
  `
  const variables = { id }
  const update = (store, { data: { deleteOption } }) => {
    const query = gql(RULE_GQL)
    const rule = deleteOption.option.rule
    const data = store.readQuery({ query, variables: { id: rule.id } });
    let option = _.find(data.rule.options, {id: deleteOption.option.id })
    option.values = _.reject(option.values, { id: deleteOption.id })
    store.writeQuery({ query, data })
  }

  const optimisticResponse = {
    __typename: 'Mutation',
    deleteOption: {
      __typename: 'Option',
      id: OptionId,
      option: {
        __typename: 'RuleOption',
        id: '1'
      }
    },
  }

  apolloClient.mutate({
    mutation, variables, update
  })
}

function* deleteRule({ id }) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation ($id: ID!){
      deleteRule(id: $id) {
        id
        styleGuide {
          id
          rules {
            id
          }
          organization {
            id
            domain
          }
        }
      }
    }
  `
  const variables = { id }

  try {
    const result = yield call(apolloClient.mutate, { mutation, variables })
    const rule = result.data.deleteRule
    yield put(push(`/organizations/${rule.styleGuide.organization.domain}/style-guides/${rule.styleGuide.id}`))
  } catch(error) {
    const message = parseErrorMessage(error)
    AppToaster.show({ message, intent: Intent.DANGER })
  }
}

function* deleteParam({id}) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation ($id: ID!){
      deleteParam(id: $id) {
        id
        rule {
          id
          params {
            id
          }
        }
      }
    }
  `
  const variables = { id }
  const update = (store, { data: { deleteParam } }) => {
    const query = gql(RULE_GQL)
    let rule = deleteParam.rule
    const data = store.readQuery({ query, variables: { id: rule.id } });
    // let rule = _.find(data.rule, {id: deleteRuleOption.rule.id })
    rule.params = _.reject(rule.params, { id: deleteParam.id })
    store.writeQuery({ query, data })
  }

  apolloClient.mutate({
    mutation, variables, update
  }).then(result => {
    // console.log('result');
    // console.dir(result);
    // result => data.cloneStyleGuide.id
    // AppToaster
    // AppToaster.show({ message: 'Succesfuly cloned', intent: Intent.SUCCESS})
  }).catch(error => {
    // console.log('error');
    // console.dir(error);
    // AppToaster.show({ message: `Error`, intent: Intent.DANGER })
  })
}

function* deleteComment({id}) {
  const apolloClient = yield getContext('apolloClient')
  const mutation = gql`
    mutation ($id: ID!){
      deleteComment(id: $id) {
        id
        isDeleted
      }
    }
  `
  const variables = { id }
  const optimisticResponse = {
    __typename: 'Mutation',
    deleteComment: {
      __typename: 'Comment',
      id,
      isDeleted: true
    }
  }
  apolloClient.mutate({ mutation, variables, optimisticResponse })
}

export default function* root() {
  yield watchLatest({
    [actions.vote]: vote,
    [actions.unvote]: unvote,
    [actions.voted]: voted,
    [actions.deleteRule]: deleteRule,
    [actions.deleteParam]: deleteParam,
    [actions.deleteOption]: deleteOption,
    [actions.deleteComment]: deleteComment,
  })
}
