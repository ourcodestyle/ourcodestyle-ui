import React from 'react'
import {
  Card,
  Icon,
  Intent,
  Button,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

// props:
// title
// content
export default class SectionCard extends React.Component {
  render(){
    const { intent, editAction } = this.props
    const titleBackground = intent === "create" ? "green" : "#eee"
    const titleColor = intent === "create" ? "#fff" : "#000"
    const border = intent === "create" ? '1px dashed green' : ''

    return <Card style={{ marginTop: 20, padding: 0, border, color: titleColor }}>
      <h5 style={{marginTop: -10, background: titleBackground, margin: 0, padding: 10 }}>
        { editAction && <Button small text="edit" style={{float: 'right', marginTop: -5}} onClick={editAction}  /> }
        <div>
          { this.props.icon && <Icon icon={this.props.icon} /> }
          <div style={{ display: 'inline-block', marginLeft: 10 }}>{ this.props.title }</div>
        </div>
      </h5>
      <div style={{ padding: 10 }}>
        { this.props.content || this.props.children }
      </div>
    </Card>
  }
}
