import React from 'react'
import _ from 'lodash'
import { withRouter } from 'react-router-dom'

import {
  Dialog,
  Classes,
} from '@blueprintjs/core'

import slugify from 'slugify'

import {
  Form,
  Input,
  FormSubmit,
  Errors,
} from '~/fuks'

const extraQuery = `
  memberships {
    id
    role
    user {
      id
      memberships {
        id
        role
        organization {
          id
        }
      }
    }
  }
`

const organization = {
  __typename: "Organization"
}

class CreateOrganizationModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      domain: "",
      wasManualDomainChange: false
    }
  }

  onSuccess(organization) {
    this.props.history.push(`/organizations/${organization.domain}`)
    this.props.closeModal()
  }

  render(){
    const { isOpen, closeModal } = this.props
    if (!isOpen) return null

    const onChange = (fieldName, value) => {
      if (fieldName === 'name' && !this.state.wasManualDomainChange) {
        const domain = _.toLower(slugify(value))
        this.setState({ domain })
      }
      if (fieldName === 'domain') {
        this.setState({ domain: value, wasManualDomainChange: true })
      }
    }

    return (
      <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="New Organization">
        <Form forRecord={organization} onSuccess={this.onSuccess.bind(this)} extraQuery={extraQuery} onChange={onChange}>
          <div className={Classes.DIALOG_BODY}>
            <Errors />
            <Input field="name String!"       label="Name" autoFocus />
            <Input field="domain String!"     label="Short Name for URL" value={this.state.domain} />
            <Input field="website String"     label="Website" />
            <Input field="description String" label="Description" as="textarea" />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <FormSubmit label="Create" />
            </div>
          </div>
        </Form>
      </Dialog>
    )
  }
}

export default withRouter(CreateOrganizationModal)
