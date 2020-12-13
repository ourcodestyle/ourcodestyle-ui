import React from 'react'

import {
  Dialog,
  Classes,
  Intent,
} from '@blueprintjs/core'

import {
  Form,
  Input,
  FormSubmit,
} from '~/fuks'

import { AppToaster } from '~/components/toaster'

class InviteProjectByGithubAccountLink extends React.Component {

  render() {
    const { isOpen, closeModal, project } = this.props

    if (!isOpen) return null

    const onSuccess = () => {
      AppToaster.show({ message: 'Added', intent: Intent.SUCCESS })
      closeModal()
    }

    const extraQuery = `
      project {
        id
        memberships {
          id
          role
          user {
            id
            name
            pictureUrl
            nickname
          }
        }
        personalInvitations(status: "pending") {
          id
          nickname
          status
        }
      }
    `

    const record = { __typename: "PersonalInvitation", projectId: project.id }

    return <Dialog isOpen={isOpen} onClose={closeModal} title="Add Member">
            <div className={Classes.DIALOG_BODY}>
              <Form forRecord={record} onSuccess={onSuccess} extraQuery={extraQuery}>
                <Input field="projectId ID!" as="hidden" />
                <Input field="nickname String!" as="string" label="GitHub Nickname" autoFocus />
                <FormSubmit label="Add Member" />
              </Form>
            </div>
          </Dialog>
  }

}

export default InviteProjectByGithubAccountLink
