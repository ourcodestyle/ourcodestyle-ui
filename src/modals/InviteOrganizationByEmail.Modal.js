import React from 'react'

import {
  Dialog
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit
} from '~/fuks'

class InviteOrganizationByEmail extends React.Component {

  render(){
    const { isOpen, closeModal, organization } = this.props


    if (!isOpen) return null

    const extraQuery = `
      emailInvitations {
        email
        invitation {
          secret
        }
      }
    `

    return <Dialog icon="email" isOpen={isOpen} onClose={closeModal} title="Invite Members by Email">
            <div className="pt-dialog-body">
              <Form forRecord={{ __typename: "EmailInvitationBatch", organizationId: organization.id }} extraQuery={extraQuery}>
                <Input field="organizationId ID!" as="hidden" />
                <Input field="emails String!" as="textarea" label="List of Emails" placeholder="separate emails by comma or new line" />
                <FormSubmit label="Send Invitations" />
              </Form>
            </div>
          </Dialog>
  }

}

export default InviteOrganizationByEmail