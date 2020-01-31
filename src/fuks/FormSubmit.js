import React from 'react'
import {
  Button,
  Intent,
} from '@blueprintjs/core'
import {withForm} from '~/contexts'

class FormSubmit extends React.Component {

  render(){
    const { form, onSubmit, label, loading, intent, style, minimal } = this.props

    return <Button
              onClick={onSubmit}
              intent={ intent || Intent.PRIMARY }
              text={ label || "Submit" }
              loading={loading}
              style={style}
              minimal={minimal}
            />
  }
}

export default withForm(FormSubmit)