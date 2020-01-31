import React from 'react'
import {fConnect} from '~/utils/components'
import * as allModals from '.'
import {closeModal} from '~/redux/globalActions'


class Modals extends React.Component {

  componentDidCatch(error, info){
    console.error(error);
    console.error(info);
  }

  render () {
    const {openedModal, modalProps, actions} = this.props
    if (!openedModal) return null

    const ModalClass = allModals[`${openedModal}Modal`]
    if (!ModalClass){
      throw new Error(`Unknown modal: ${openedModal}`);
    }

    return <ModalClass isOpen={true} closeModal={actions.closeModal} {...modalProps} />
  }

}

export default fConnect((state) => ({
    openedModal: state.global.get('openedModal'),
    modalProps: state.global.get('modalProps')
  }),
  {closeModal}
)(Modals)