import React from 'react'
import PropTypes from 'prop-types'
import { AppToaster } from '~/components/toaster'

import {
  Dialog,
  Intent,
} from '@blueprintjs/core'

import ParamForm from "~/components/Rules/components/ParamForm"

class CreateParamModal extends React.Component {
  render(){
    const {
      rule,
      isOpen,
      closeModal,
    } = this.props

    if (!isOpen) return null

    const onSuccess = () => {
      closeModal()
      AppToaster.show({ message: 'Created', intent: Intent.SUCCESS})
    }

    const param = {
      __typename: "Param",
      ruleId: parseInt(rule.id),
      name: "",
      description: "",
      optionsType: "Boolean",
    }

    return (
      <Dialog
        title="Create Param"
        icon="add"
        isOpen={isOpen}
        onClose={closeModal}
      >
        <ParamForm param={param} onSuccess={onSuccess} />
      </Dialog>
    )
  }
}

CreateParamModal.propTypes = {
  rule: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default CreateParamModal
