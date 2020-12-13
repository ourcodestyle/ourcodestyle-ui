import React from 'react'

import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  Dialog,
  Classes,
  Button,
  FormGroup,
  Intent
} from '@blueprintjs/core'

import Select from '~/pure/Select'
import { withCurrentUser } from '~/contexts'

import { cloneStyleGuide } from '~/redux/globalActions'
import { fConnect } from '~/utils/components'
import _ from 'lodash'

import { AsyncState } from '~/redux/globalModels'

class CloneStyleGuideModal extends React.Component {

  constructor(props) {
    super(props)

    if (props.projects.length > 0){
      this.state = { selectedProjectId: props.projects[0].id }
    }
  }

  render(){
    const { isOpen, closeModal, styleGuideId, projects, requestId, requestState, actions } = this.props
    if (!isOpen) return null

    const collection = projects.map(project => ({
      value: project.id,
      label: project.name
    }))

    const onChange = (event) => {
      this.setState({ selectedProjectId: event.target.value })
    }

    const params = {
      styleGuideId,
      requestId,
      projectId: this.state.selectedProjectId,
    }

    const onClickClone = () => {
      actions.cloneStyleGuide(params)
    }

    return <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="Clone Style Guide">
              <div className={Classes.DIALOG_BODY}>
                { projects.length > 0 && <FormGroup label="Select Project to clone to">
                  <Select
                    collection={collection}
                    onChange={onChange}
                    value={this.state.selectedProjectId}
                    />
                </FormGroup> }
                { projects.length == 0 && "You don't have Projects to clone into" }
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button loading={requestState.pending} disabled={projects.length == 0} text="Clone" intent={Intent.PRIMARY} onClick={onClickClone} />
                </div>
              </div>
          </Dialog>
  }

}

const mapStateToProps = (state, ownProps) => {
  const projects = _.chain(ownProps.currentUser.memberships).
    filter({role: 'admin'}).
    map('project').
    reject({id: ownProps.styleGuideProjectId}).
    value()

  const requestState = state.requestState.get(ownProps.requestId, AsyncState.init)

  return {
    projects,
    requestState
  }
}

export default compose(
  withCurrentUser,
  fConnect(
    mapStateToProps,
    {cloneStyleGuide}
  ),
  withRouter,
)(CloneStyleGuideModal)
