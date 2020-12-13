import React from 'react'
import { Tab, Tabs } from "@blueprintjs/core"
import { withRouter } from 'react-router-dom'

class ShowTabs extends React.Component {

  render() {
    const { selectedTab, projectDomain, canEdit, history } = this.props

    const handleTabChange = (selectedTabId) => {
      history.push(`/projects/${projectDomain}/${selectedTabId}`)
    }

    return <Tabs onChange={handleTabChange} selectedTabId={selectedTab} large={true} animate={false}>
                <Tab id="dashboard" title="Dashboard" />
                <Tab id="members" title="Members" />
                { canEdit && <Tab id="settings" title="Settings" /> }
            </Tabs>
  }

}

export default withRouter(ShowTabs)
