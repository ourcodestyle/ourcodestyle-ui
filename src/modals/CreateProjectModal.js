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
        project {
          id
        }
      }
    }
  }
`

const project = {
  __typename: "Project"
}

class CreateProjectModal extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      wasManualDomainChange: false
    }
  }

  onSuccess(project) {
    this.props.history.push(`/projects/${project.domain}`)
    this.props.closeModal()
  }

  render(){
    const { isOpen, closeModal } = this.props
    if (!isOpen) return null

    const onChange = (fieldName, value, setFormField) => {
      if (fieldName === 'name' && !this.state.wasManualDomainChange) {
        const domain = _.toLower(slugify(value))
        // setFormField('domain', domain)
        return {
          setForm: (form) => {
            return Object.assign({}, form, { domain })
          }
        }
      }
      if (fieldName === 'domain') {
        this.setState({ wasManualDomainChange: true })
      }
    }

    return (
      <Dialog icon="add" isOpen={isOpen} onClose={closeModal} title="New Project">
        <Form forRecord={project} onSuccess={this.onSuccess.bind(this)} extraQuery={extraQuery} onChange={onChange}>
          <div className={Classes.DIALOG_BODY}>
            <Errors />
            <Input field="name String!"       label="Name" autoFocus />
            <Input field="domain String!"     label="Short Name for URL" />
            <Input field="website String"     label="Website" />
            <Input field="description String" label="Description" as="textarea" />

            <h4>Linters (can be added later):</h4>
            <Input field="addStyleGuides [String!]" value="rubocop" label="RuboCop" as="switch" />
            <Input field="addStyleGuides [String!]" value="eslint" label="ESLint" as="switch" />
            <Input field="addStyleGuides [String!]" value="free_form" label="Free Form" as="switch" />
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

export default withRouter(CreateProjectModal)
