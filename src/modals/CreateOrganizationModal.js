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

class CreateOrganizationModal extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      domain: "",
      wasManualDomainChange: false
    }
  }

  render(){
    const { isOpen, closeModal, history } = this.props
    if (!isOpen) return null

    const organization = {
      __typename: "Organization"
    }

    const onSuccess = (organization) => {
      history.push(`/organizations/${organization.domain}`)
      closeModal()
    }

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
        <Form forRecord={organization} onSuccess={onSuccess} extraQuery={extraQuery}  onChange={onChange}>
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
