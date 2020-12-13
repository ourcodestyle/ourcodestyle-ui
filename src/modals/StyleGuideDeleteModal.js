import React from 'react'
import { withRouter } from 'react-router-dom'

import {
  Dialog,
  Button,
  Intent,
  Classes,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import {
  Form,
  FormSubmit,
  Errors
} from '~/fuks'

class StyleGuideDelete extends React.Component {

  render(){
    const props = this.props

    const onSuccess = (styleGuide) => {
      props.closeModal()
      props.history.push(`/projects/${props.styleGuide.project.domain}/style-guides`)
    }

    return (
      <Dialog
        icon={IconNames.DELETE}
        isOpen={props.isOpen}
        onClose={props.closeModal}
        title="Delete StyleGuide"
      >
        <Form forRecord={props.styleGuide} onSuccess={onSuccess} action="delete">
          <div className={Classes.DIALOG_BODY}>
            <Errors />
            Are you sure?
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button text="Cancel" onClick={props.closeModal} />
              <FormSubmit label="Delete" intent={Intent.DANGER} />
            </div>
          </div>
        </Form>
      </Dialog>
    )
  }
}

export default withRouter(StyleGuideDelete)
