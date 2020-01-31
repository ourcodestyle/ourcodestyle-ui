import React from 'react'
import PropTypes from 'prop-types'
import copyToClipboard from 'copy-to-clipboard'
import { AppToaster } from '~/components/toaster'
import {
  Button,
} from '@blueprintjs/core'

const CopyToClipboard = ({text, buttonProps={}}) => {
  return <Button 
    className="pt-fixed" 
    title="Copy link to clipboard" 
    icon="clipboard" 
    onClick={() => {
      copyToClipboard(text)
      AppToaster.show({ message: 'Copied', intent: 'success'})
    }}
    { ...buttonProps }
  />
}

CopyToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  buttonProps: PropTypes.object
}

export default CopyToClipboard