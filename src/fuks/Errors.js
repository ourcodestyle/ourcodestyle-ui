import React from 'react'
import {
  Callout,
  Intent,
} from '@blueprintjs/core'
import {withForm} from '~/contexts'

class Errors extends React.Component {

  render(){
    const { errors } = this.props
    if (errors.length === 0) return null
    return <Callout intent={Intent.DANGER} title="Failed" style={{marginBottom: 10}}>
      { errors.map(({message}) => {
        return <p key={message}>{message}</p>
      }) }
    </Callout>
  }
}

export default withForm(Errors)