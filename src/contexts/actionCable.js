import React from 'react'

export const ActionCableContext = React.createContext({})

export function withActionCable(Component) {
  return function ComponentWithActionCable(props) {
    return (
      <ActionCableContext.Consumer>
        {(actionCable) => <Component {...props} actionCable={actionCable} />}
      </ActionCableContext.Consumer>
    )
  }
}