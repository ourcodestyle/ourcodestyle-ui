import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

import _ from 'lodash'

import {
  Dialog,
  Button,
  Intent,
  Classes,
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
  Errors
} from '~/fuks'

import {USER} from '~/gql/fragments'

import languages from '~/lists/languages'
import linters from '~/lists/linters'

class CreateStyleGuide extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      language: null,
      linter: null,
      name: "",
    }
  }

  render(){
    const props = this.props

    const onClose = (...args) => {
      props.closeModal()
    }

    const styleGuide = {
      __typename: 'StyleGuide',
      organizationId: props.organizationId,
      language: this.state.language,
      linter: this.state.linter,
      wasManualNameChange: false,
    }

    const onSuccess = (styleGuide) => {
      props.closeModal()
      props.history.push(`/organizations/${props.organizationDomain}/style-guides/${styleGuide.id}`)
    }

    const onChange = ((fieldName, value) => {
      if (fieldName === 'linter') {
        const linter = _.find(linters, {value})
        const language = linter ? linter.language : null
        let data = { language, [fieldName]: value }
        if (language && !this.state.wasManualNameChange) {
          const languageLabel = _.find(languages, {value: language}).label
          data.name = `${languageLabel} Guide`
        }
        this.setState(data)
      } else if (fieldName === 'language' && !this.state.wasManualNameChange) {
        const language = value
        const languageLabel = _.find(languages, {value: language}).label
        this.setState({ language: value, name: `${languageLabel} Guide` })
      } else {
        this.setState({ [fieldName]: value })
      }

      if (fieldName === 'name') {
        this.setState({ name: value, wasManualNameChange: true })
      }
    }).bind(this)

    const extraQuery = `
      organization {
        id
        styleGuides {
          id
          name
          language
          linter
          isPublic
          createdByUser {
            ... USER
          }
        }
      }
    `
    const extraQueryFragments = [USER]


    return (
      <Dialog
        icon="add"
        isOpen={props.isOpen}
        onClose={onClose}
        title="Add Style Guide"
      >
        <Form
          forRecord={styleGuide}
          onSuccess={onSuccess}
          extraQuery={extraQuery}
          extraQueryFragments={extraQueryFragments}
          onChange={onChange}
          >
          <div className={Classes.DIALOG_BODY}>
            <Errors />
            <Input field="organizationId ID" as="hidden" />
            <Input field="linter String" label="Linter" as="select" collection={linters} includeBlank={true} hideOptionalLabel={true} />
            <Input
              field="language String"
              label="Programming Language"
              as="select"
              collection={_.sortBy(languages, 'label')}
              includeBlank={true}
              inputProps={{disabled: !!this.state.linter}}
              value={this.state.language}
              hideOptionalLabel={true}
              />
            <Input field="name String!"       label="Name" autoFocus value={this.state.name} />
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

export default withRouter(CreateStyleGuide)