import React from 'react'
import {
  Button,
  Intent,
  Callout,
  Icon,
  Card,
} from '@blueprintjs/core'
import { Link } from 'react-router-dom'

import {
  StyleGuideIcon,
  ProjectIcon,
} from '~/pure/icons'

import { actionsConnect } from '~/utils/components'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  withCurrentUser,
  withRouting,
} from '~/contexts'

import Activity from '~/components/Activity/Activity'
import { openModal } from '~/redux/globalActions'

class Dashboard extends React.Component {

  render() {
    if (this.props.currentUser.memberships.length > 0) {
      return this.displayProjects()
    } else {
      return this.noProjects()
    }
  }

  noProjects() {
    const {
      currentUser,
      actions,
    } = this.props

    const clickNewProject = () => {
      actions.openModal({modalName: "CreateProject", modalProps: {} })
    }

    return <div>
      <Card style={{ width: 600, margin: 'auto', marginTop: 50 }}>
        <h1>No Projects</h1>

        <p>
          In order to work with site you need to belong to some project.
        </p>
        <p>Ask your colleage to add you as project member.</p>

        <hr style={{ marginTop: 50, marginBottom: 50, border: 'none', borderTop: '1px solid #ccc' }} />

        <p>Or create project by yourself now</p>
        <Button
          text="Create Project"
          icon="add"
          onClick={clickNewProject}
        />
      </Card>
    </div>
  }

  displayProjects() {
    const {
      currentUser,
      actions,
    } = this.props

    return <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gridGap: 40 }}>

      <div style={{ background: "#eef", paddingLeft: 10, paddingTop: 20 }}>

        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Style Guides</div>

        <ul className="section-list">
        { currentUser.memberships.map(membership => {
          const project = membership.project
          return <li key={membership.id} className="first">
            <Link to={`/projects/${project.domain}`}>
              <ProjectIcon project={project} style={{height: 30, marginTop: -10, position: 'absolute'}} />
              <div style={{ marginBottom: 10, paddingLeft: 40, fontWeight: 'bold', color: "#000", textDecoration: 'underline' }}>
                { project.name }
              </div>
            </Link>
            <ul>
              { membership.project.styleGuides.map(styleGuide => {
                return <li key={styleGuide.id}>
                  <Link to={`/projects/${project.domain}/style-guides/${styleGuide.id}`}>
                    <StyleGuideIcon styleGuide={styleGuide} style={{height: 20}} />
                    {styleGuide.name}
                  </Link>
                </li>
              }) }
            </ul>
          </li>
        }) }
        </ul>

      </div>
      <div style={{ paddinTop: 50 }}>
        <h2 style={{ marginBottom: 40 }}>Activity</h2>
        {this.activity()}
      </div>
    </div>
  }

  activity(){
    return <Activity small perPage={20} />
  }
}

export default compose(
  actionsConnect({openModal}),
  withCurrentUser,
  withRouting,
)(Dashboard)
