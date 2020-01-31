import React from 'react'
import PropTypes from 'prop-types'
import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  Intent,
} from '@blueprintjs/core'

import OptionForm from "~/components/Rules/components/OptionForm"

class EditOptionModal extends React.Component {
  render(){
    const { isOpen, closeModal, option, param } = this.props
    if (!isOpen) return null

    const onSuccess = () => {
      closeModal()
      AppToaster.show({ message: 'Updated', intent: Intent.SUCCESS})
    }

    return (
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit Option"
      >
        <OptionForm
          option={option}
          param={param}
          onSuccess={onSuccess}
        />
      </Dialog>
    )
  }
}


EditOptionModal.propTypes = {
  option: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default EditOptionModal
