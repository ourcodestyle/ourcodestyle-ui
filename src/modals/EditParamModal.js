import React from 'react'
import PropTypes from 'prop-types'
import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  Intent,
} from '@blueprintjs/core'

import ParamForm from "~/components/Rules/components/ParamForm"

const EditParamModal = (props) => {
  const {
    param,
    isOpen,
    closeModal,
  } = props

  if (!isOpen) return null

  const onSuccess = () => {
    closeModal()
    AppToaster.show({ message: 'Updated', intent: Intent.SUCCESS})
  }

  return (
    <Dialog
      title="Edit Param"
      icon="edit"
      isOpen={isOpen}
      onClose={closeModal}
    >
      <ParamForm param={param} onSuccess={onSuccess} />
    </Dialog>
  )
}

EditParamModal.propTypes = {
  param: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default EditParamModal
