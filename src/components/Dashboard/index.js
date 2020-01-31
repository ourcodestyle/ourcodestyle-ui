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
  OrganizationIcon,
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
      return this.displayOrganizations()
    } else {
      return this.noOrganizations()
    }
  }

  noOrganizations() {
    const {
      currentUser,
      actions,
    } = this.props

    const clickNewOrganization = () => {
      actions.openModal({modalName: "CreateOrganization", modalProps: {} })
    }

    return <div>
      <Card style={{ width: 600, margin: 'auto', marginTop: 50 }}>
        <h1>No Organizations</h1>

        <p>
          In order to work with site you need to belong to some organization.
        </p>
        <p>Ask your colleage to add you as organization member.</p>

        <hr style={{ marginTop: 50, marginBottom: 50, border: 'none', borderTop: '1px solid #ccc' }} />

        <p>Or create organization by yourself now</p>
        <Button
          text="Create Organization"
          icon="add"
          onClick={clickNewOrganization}
        />
      </Card>
    </div>
  }

  displayOrganizations() {
    const {
      currentUser,
      actions,
    } = this.props

    return <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gridGap: 40 }}>

      <div style={{ background: "#eef", paddingLeft: 10, paddingTop: 20 }}>

        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Style Guides</div>

        <ul className="section-list">
        { currentUser.memberships.map(membership => {
          const organization = membership.organization
          return <li key={membership.id} className="first">
            <Link to={`/organizations/${organization.domain}`}>
              <OrganizationIcon organization={organization} style={{height: 30, marginTop: -10, position: 'absolute'}} />
              <div style={{ marginBottom: 10, paddingLeft: 40, fontWeight: 'bold', color: "#000", textDecoration: 'underline' }}>
                { organization.name }
              </div>
            </Link>
            <ul>
              { membership.organization.styleGuides.map(styleGuide => {
                return <li key={styleGuide.id}>
                  <Link to={`/organizations/${organization.domain}/style-guides/${styleGuide.id}`}>
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