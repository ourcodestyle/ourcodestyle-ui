import React from 'react'
import gql from "graphql-tag"
import _ from 'lodash'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'

import QueryComponent from '~/fuks/QueryComponent'
import UserAvatar from '~/pure/UserAvatar'
import UserIconWithName from '~/pure/UserIconWithName'
import UserIcon from '~/pure/UserIcon'
import Code from '~/pure/Code'
import { Button, Icon, Card, Dialog, Intent, Divider } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import {
  VOTE,
  COMMENT,
  USER,
} from '~/gql/fragments'

class Activity extends QueryComponent {

  constructor(props){
    super(props)
  }

  query() {
    const scope = this.props.scope || {}
    // eg "$organizationId: ID!"
    const conditionTypes = _.map(scope, (data,key) => `$${key}: ${data.type}`).join(', ')
    // eg "organizationId: $organizationId"
    const conditionPlaceholders = _.map(scope, (_data,key) => `${key}: $${key}`).join(', ')

    const queryArgsConfig = _.compact([conditionTypes, '$perPage: Int', '$page: Int']).join(", ")
    const queryArgs = _.compact([conditionPlaceholders, 'perPage: $perPage', 'page: $page', 'order: "created_at desc"']).join(', ')

    return `
      query activities(${queryArgsConfig}) {
        activities(${queryArgs}) {
          id
          action
          createdAt
          trackable {
            ... on Vote {
              id
              optionId
              option {
                id
                value
                description
                param {
                  id
                  name
                  description
                  isSwitch
                  rule {
                    id
                    name
                    description
                    shortDescription
                  }
                }
              }
            }
            ... on Comment {
              id
              text
              intent
              commentable {
                ... on Option {
                  id
                  value
                  description
                  param {
                    id
                    name
                    description
                    isSwitch
                    rule {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
          user {
            ... USER
          }
          organization {
            id
            name
            domain
          }
          styleGuide {
            id
            name
            language
          }
        }
      }
      ${USER}
    `
  }

  queryOptions(){
    return { fetchPolicy: "cache-and-network" }
  }

  queryVariables(){
    let scopeVariables = {}

    _.each(this.props.scope, (data, key) => {
      scopeVariables[key] = data.value
    })
    const perPage = this.props.perPage || 20
    return {
      page: 1,
      perPage: perPage,
      ...scopeVariables
    }
  }

  queryLoaded(data) {
    this.setState({activities: data.activities, page: 1})
  }

  loadMore(){
    let variables = this.queryVariables()
    const page = this.state.page + 1
    this.setState({ page, loadingMore: true })
    variables.page = page
    this.loadQuery({variables, isMore: true})
  }

  moreQueryLoaded(data) {
    const newActivities = this.state.activities.concat(data.activities)
    this.setState({ activities: newActivities, loadingMore: false })
  }

  componentDidMount() {
    super.componentDidMount()
  }

  buildActivity(activity) {
    let content = null

    try {
      if (activity.action === 'commented') {
        content = this.buildActivityCommented(activity)
      } else if (activity.action === 'voted') {
        content = this.buildActivityVoted(activity)
      }

      return <div className="activity-container" key={activity.id}>
        {content}
      </div>
    } catch(error){
      console.log('Error:');
      console.dir({error, activity});
      return null
    }
    // , <Divider style={{ marginTop: 30, marginBottom: 10 }} />]
  }

  buildActivityCommented(activity){
    const user = activity.user
    const commnent = activity.trackable
    const option = commnent.commentable
    const rule = option.param.rule
    let linkParts = ['organizations', activity.organization.domain, 'style-guides', activity.styleGuide.id, 'rules', rule.id]
    const link = '/' + linkParts.join('/')

    let icon = null
    if (commnent.intent == 'positive') {
      icon = <Icon icon={IconNames.THUMBS_UP} />
    } else if (commnent.intent == 'negative') {
      icon = <Icon icon={IconNames.THUMBS_DOWN} />
    }

    return <div key={activity.id}>
      <div className="activity-head">
        { this.props.small ? <UserIcon user={user} /> : <UserIconWithName user={user} /> }
        <span>Left a comment on option <b>{option.value}</b> in rule </span>
        <b><Link to={link}>{rule.name}</Link></b>
        <span className="activity-date"><TimeAgo date={activity.createdAt} /></span>
      </div>
      <div className="activity-body">
        <div className="comment-container">
          {icon}
          <span style={{marginLeft: 10}}>{commnent.text}</span>
        </div>
      </div>
    </div>
  }

  buildActivityVoted(activity) {
    const user = activity.user
    const vote = activity.trackable
    const option = vote.option
    const param = option.param
    const rule = param.rule
    const styleGuide = activity.styleGuide

    let linkParts = ['organizations', activity.organization.domain, 'style-guides', activity.styleGuide.id, 'rules', rule.id]
    const link = '/' + linkParts.join('/')

    let votedFor = null
    if (option.isSwitch) {
      const voteAction = option.name === "true" ? "enable" : "disable"
      votedFor = <span>voted to <b>{voteAction}</b> rule</span>
    } else {
      votedFor = <span>voted for option <b>{option.value}</b> in rule</span>
    }

    let activityBody = null
    if (option.isSwitch) {
      activityBody = <Card>{rule.shortDescription || rule.description}</Card>
    } else if (option.description) {

      activityBody = this.props.small ? "" :
      <Code value={option.description} language={styleGuide.language} readOnly={true} />

    }

    return <div key={activity.id}>
      <div className="activity-head">
        { this.props.small ? <UserIcon user={user} /> : <UserIconWithName user={user} /> }

        {votedFor}

        <b><Link to={link}>{rule.name}</Link></b>
        <span className="activity-date"><TimeAgo date={activity.createdAt} /></span>
      </div>
      { activityBody &&
      <div className="activity-body">
        {activityBody}
      </div>
      }
    </div>
  }

  content(){
    console.log('this.context.client');
    console.dir(this.context.client);
    const activites = this.state.activities.map(this.buildActivity.bind(this))
    // const size = this.props.size
    // const templateColumns = size === "small" ? "300px" : "1fr 400px"
    // let style = { display: "grid", gridTemplateColumns: "1fr 400px" }
    let style = {}
    let className = ""
    if (this.props.small){
      style = {}
      className = "activity-small"
    }

    return <div style={style} className={className}>
      <div className="activity-list">
        { activites }
        <Button
          text="More"
          fill
          large
          onClick={this.loadMore.bind(this)}
          loading={this.state.loadingMore}
          />
      </div>
    </div>
  }
}

export default Activity
