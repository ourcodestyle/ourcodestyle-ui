import React from 'react'
import PropTypes from 'prop-types'
import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  Intent,
} from '@blueprintjs/core'

import OptionForm from "~/components/Rules/components/OptionForm"

class CreateOptionModal extends React.Component {
  render(){
    const {
      isOpen,
      closeModal,
      param,
    } = this.props
    if (!isOpen) return null

    const onSuccess = () => {
      closeModal()
      AppToaster.show({ message: 'Created', intent: Intent.SUCCESS})
    }

    const option = {
      __typename: "Option",
      paramId: parseInt(param.id),
      value: "",
      description: "",
    }

    return (
      <Dialog
        icon="add"
        isOpen={isOpen}
        onClose={closeModal}
        title="Create Option"
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

CreateOptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  param: PropTypes.object.isRequired,
}

export default CreateOptionModal
