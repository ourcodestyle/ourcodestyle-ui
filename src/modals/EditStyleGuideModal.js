import React from 'react'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

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

import RecordForm from '~/components/StyleGuides/Form'

class StyleGuideEdit extends React.Component {

  render(){
    const props = this.props

    const styleGuide = props.styleGuide
    const redirectTo = (location) => () => {
      props.history.push(location)
    }

    const onClose = (...args) => {
      props.closeModal()
    }

    const onSuccess = (styleGuide) => {
      props.closeModal()   
    }

    return (
      <Dialog
        icon="edit"
        isOpen={props.isOpen}
        onClose={onClose}
        title="Edit Style Guide"
      >
        <RecordForm record={styleGuide} onSuccess={onSuccess} />
      </Dialog>
    )
  }
}

export default withRouter(StyleGuideEdit)