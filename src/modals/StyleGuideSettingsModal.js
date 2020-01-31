import React from 'react'

import {
  Dialog,
} from '@blueprintjs/core'

import StyleGuideSettings from '~/components/StyleGuides/StyleGuideSettings'

class StyleGuideSettingsModal extends React.Component {

  render(){
    const { isOpen, closeModal, styleGuideId } = this.props
    if (!isOpen) return null

    return <Dialog icon="settings" isOpen={isOpen} onClose={closeModal} title="Style Guide Settings" style={{ width: 860 }}>
            <StyleGuideSettings styleGuideId={styleGuideId} />
          </Dialog>
  }
}

export default StyleGuideSettingsModal