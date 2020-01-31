import React from 'react'
import { Button, Dialog, Intent } from '@blueprintjs/core'
import {fConnect} from '~/utils/components'

class SignInDialog extends React.Component {

  render(){
    const { isOpen } = this.props
    const toggleDialog = () => null

    return <Dialog
              icon="inbox"
              isOpen={isOpen}
              onClose={toggleDialog}
              title="Dialog header"
           >
            <div className="pt-dialog-body">Some content</div>
            <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                    <Button text="Secondary" />
                    <Button
                        intent={Intent.PRIMARY}
                        onClick={toggleDialog}
                        text="Primary"
                    />
                </div>
            </div>
           </Dialog>
  }
}

export default SignInDialog