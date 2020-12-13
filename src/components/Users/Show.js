import React from 'react'
import {withCurrentUser} from '~/contexts'
import {withRouter} from 'react-router-dom'
import {fConnect} from '~/utils/components'
import {compose} from 'redux'
import {Link} from 'react-router-dom'

import {
  Button,
  Tab,
  Tabs,
  HTMLTable,
  Icon,
  Tag
} from '@blueprintjs/core'
import { openModal } from '~/redux/globalActions'

import {ProjectIcon} from '~/pure/icons'
import Activity from '~/components/Activity/Activity'

import QueryComponent from '~/fuks/QueryComponent'
import UserIconWithName from '../../pure/UserIconWithName';

class Show extends QueryComponent {

  componentDidUpdate(prevProps, prevState, snapshot) {
    // super.componentDidUpdate(prevProps, prevState, snapshot)
    if (this.props.nickname !== prevProps.nickname) {
      this.setState({loading: true, error: null })
      this.startLoadQuery()
    }
  }

  query(){
    return `
      query($nickname: String){
        user(nickname: $nickname) {
          id
          name
          nickname
          fullName
          pictureUrl
          maxProjectsCount
          votesCount
          memberships {
            id
            role
            project {
              id
              name
              domain
              createdByUserId
            }
          }
          codeStyleMates {
            id
            matchCount
            mateUser {
              id
              name
              nickname
              fullName
              pictureUrl
            }
          }
        }
      }
    `
  }

  queryVariables(){
    return {
      nickname: this.props.nickname
    }
  }

  queryLoaded(data) {
    this.setState({user: data.user})
  }

  selectedTab(){
    return this.props.match.params.selectedTab || "general"
  }

  tabs(){
    const history = this.props.history
    const nickname = this.props.match.params.nickname
    const handleTabChange = (selectedTab) => history.push(`/users/${nickname}/${selectedTab}`)

    return <Tabs onChange={handleTabChange} selectedTabId={this.selectedTab()} large={true} animate={false}>
                <Tab id="general"  title="General" />
                <Tab id="activity" title="Activity" />
            </Tabs>
  }

  head(){
    const user = this.state.user
    return <div className="user-title">
      <div className="user-logo-and-name-container">
        <div className="user-logo-and-name">
          <div className="user-logo-holder">
            <img src={ user.pictureUrl || '/images/user-no-picture.png' }  />
          </div>
          <div>
            <h1 className="user-name">{user.name}</h1>
            <div>
              <a href={`https://github.com/${user.nickname}`} target="_blank">@{user.nickname}</a>
            </div>
            { false &&
              <div style={{marginTop: -30}}>
                <Button
                  text="Edit Profile"
                  icon="edit"
                  onClick={() => actions.openModal({ modalName: "EditUserProfile", modalProps: {} }) }
                />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  }

  tabContent(){
    if (this.selectedTab() == "general"){
      return this.generalTab()
    } else if (this.selectedTab() == "activity") {
      return this.activityTab()
    } else {
      throw `Unknown tab ${selectedTab}`
    }
  }

  projects(){
    const props = this.props

    return <HTMLTable bordered striped>
      <thead>
        <tr>
          <th colSpan={3}>
            <h3 className="section-title">Projects</h3>
          </th>
        </tr>
      </thead>
      <tbody>
      { this.state.user.memberships.map(membership => {
        const project = membership.project
        return <tr key={project.id}>
          <td style={{ width: 44 }}>
            <ProjectIcon project={project} style={{ width: 30, height: 30, position: 'absolute', marginTop: -6, marginLeft: -6 }} />
          </td>
          <td>
            <Link to={`/projects/${project.domain}`}>{project.name}</Link>
          </td>
          <td>
            <Tag>{membership.role}</Tag>
            { this.state.user.id === project.createdByUserId && <Tag intent="success" style={{marginLeft: 5}}>creator</Tag> }
          </td>
        </tr>
      }) }
      <tr>
        <td colSpan={3}>
          { this.isCurrentUserProfile() && this.createProjectButton() }
        </td>
      </tr>
      </tbody>
    </HTMLTable>
  }

  createProjectButton(){
    const props = this.props
    const createdProjectsCount = _.filter(this.state.user.memberships, m => m.project.createdByUserId === this.state.user.id).length
    const maxReached = createdProjectsCount >= this.state.user.maxProjectsCount
    const clickNewProject = () => {
      props.actions.openModal("CreateProject")
    }
    return <div>
        <Button
        disabled={maxReached}
        text="Create Project"
        icon="add"
        onClick={clickNewProject}
      />
      { maxReached && <div className="small-notice">Max number of projects created</div>}
    </div>
  }

  codeStyleMates(){
    const user = this.state.user
    const minVotes = 10

    return <div style={{marginTop: 40}}>
      <h3 className="section-title">
        <Icon icon="heart" style={{ verticalAlign: 'middle', marginRight: 12, color: 'red' }} />
        Code Style Mates
      </h3>
      <If condition={user.votesCount < minVotes}>
        <div>Need at least {minVotes} votes to find mates. (now have {user.votesCount} votes)</div>
      </If>
      <If condition={user.votesCount >= minVotes}>
        <HTMLTable style={{width: '100%'}} striped>
          <thead>
            <tr>
              <th style={{width: 60}}>#</th>
              <th>User</th>
              <th style={{width: 100, textAlign: 'center'}}>Matches</th>
            </tr>
          </thead>
          <tbody>
            { user.codeStyleMates.map((csm,i) => {
              return <tr>
                <td>
                  {i+1}
                </td>
                <td>
                  { i === 0 && <span style={{marginTop: -10, marginLeft: 5, position: 'absolute'}}>👑</span> }
                  <UserIconWithName user={csm.mateUser} />
                </td>
                <td style={{textAlign: 'center'}}>{csm.matchCount}</td>
              </tr>
            }) }
          </tbody>
        </HTMLTable>
      </If>
    </div>
  }

  generalTab(){
    return <div>
      {this.projects()}
      {this.codeStyleMates()}
    </div>
  }

  activityTab(){
    const scope = { userId: { value: this.state.user.id, type: 'ID!' } }
    return <div>
      <h2 className="section-title">Activity</h2>
      <Activity scope={scope} />
    </div>
  }

  body(){
    return <div style={{display: 'grid', gridTemplateColumns: '500px 1fr', gridColumnGap: '60px', width: '100%' }}>
      <div>{this.generalTab()}</div>
      <div>{this.activityTab()}</div>
    </div>
  }

  content(){
    return <div>
      {this.head()}
      {this.body()}
    </div>
  }

  isCurrentUserProfile(){
    return this.state.user.id === this.props.currentUser.id
  }
}

export default compose(
  withCurrentUser,
  withRouter,
  fConnect(() => ({}), {openModal})
)(Show)
