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

    if (props.organizations.length > 0){
      this.state = { selectedOrganizationId: props.organizations[0].id }
    }
  }

  render(){
    const { isOpen, closeModal, styleGuideId, organizations, requestId, requestState, actions } = this.props
    if (!isOpen) return null

    const collection = organizations.map(organization => ({
      value: organization.id,
      label: organization.name
    }))

    const onChange = (event) => {
      this.setState({ selectedOrganizationId: event.target.value })
    }

    const params = {
      styleGuideId,
      requestId,
      organizationId: this.state.selectedOrganizationId,
    }

    const onClickClone = () => {
      actions.cloneStyleGuide(params)
    }

    return <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="Clone Style Guide">
              <div className={Classes.DIALOG_BODY}>
                { organizations.length > 0 && <FormGroup label="Select Organization to clone to">
                  <Select
                    collection={collection}
                    onChange={onChange}
                    value={this.state.selectedOrganizationId}
                    />
                </FormGroup> }
                { organizations.length == 0 && "You don't have Organizations to clone into" }
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                  <Button loading={requestState.pending} disabled={organizations.length == 0} text="Clone" intent={Intent.PRIMARY} onClick={onClickClone} />
                </div>
              </div>
          </Dialog>
  }

}

const mapStateToProps = (state, ownProps) => {
  const organizations = _.chain(ownProps.currentUser.memberships).
    filter({role: 'admin'}).
    map('organization').
    reject({id: ownProps.styleGuideOrganizationId}).
    value()

  const requestState = state.requestState.get(ownProps.requestId, AsyncState.init)

  return {
    organizations,
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