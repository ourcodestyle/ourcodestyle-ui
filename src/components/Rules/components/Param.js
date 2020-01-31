import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup
} from '@blueprintjs/core'

import Markdown from '~/pure/Markdown'
import Option from './Option'
import {
  deleteParam
} from '~/components/Rules/redux/actions'


class RuleOption extends React.Component {

  addValue(){
    const { rule, param, openModal } = this.props
    if (param.optionsType === 'Boolean') return null

    const onClick = () => openModal({
      modalName: "CreateOption",
      modalProps: {
        rule,
        param
      }
    })
    return <Button
      style={{marginTop: 20}}
      fill
      large
      text="Add Option"
      icon="add"
      onClick={onClick}
    />
  }

  suggestValueButton(){
    const { rule, param, openModal } = this.props
    const onClick = () => openModal({
      modalName: "CreateOption",
      modalProps: {
        rule,
        param
      }
    })
    return <Button
      style={{marginTop: 20}}
      fill
      large
      text="Suggest Option"
      icon="add"
      onClick={onClick}
    />
  }

  deleteParam(){
    const { param, openModal } = this.props
    const onClick = () => openModal({
      modalName: "ConfirmDelete",
      modalProps: {
        action: deleteParam({ id: param.id })
      }
    })
    return <Button
      text="Delete Param"
      icon="trash"
      onClick={onClick}
    />
  }

  editParam(){
    const { param, openModal } = this.props

    const onClick = () => openModal({
      modalName: "EditParam",
      modalProps: {
        param,
      }
    })

    return <Button
      text="Edit Param"
      icon="edit"
      onClick={onClick}
    />
  }

  render() {
    const { rule, param, styleGuide, canEdit, canSuggest } = this.props
    // const showSuggestButton = canSuggest && param.allowAddOptions
    const showSuggestButton = param.allowAddOptions

    return <div className="rule-option">
        <h2>{param.name}</h2>
        { canEdit && this.manage() }

      { param.description && <div style={{marginBottom: 20}}><Markdown source={param.description} /></div> }

      <div className="rule-options-list">
        { _.sortBy(param.options, 'id').map(option => {
        return <Option
                key={option.id}
                rule={rule}
                param={param}
                option={option}
                votes={_.filter(rule.votes, { optionId: option.id })}
                openModal={this.props.openModal}
                styleGuide={styleGuide}
                canEdit={canEdit}
                canSuggest={canSuggest}
              />
        })}
      </div>
      { showSuggestButton && this.suggestValueButton() }
      { !showSuggestButton && canEdit && this.addValue() }
    </div>
  }

  manage(){
    return <ButtonGroup style={{marginBottom: 20}}>
      {this.editParam()}
      {this.deleteParam()}
    </ButtonGroup>
  }
}

RuleOption.propTypes = {
  rule: PropTypes.object.isRequired,
  param: PropTypes.object.isRequired,
  styleGuide: PropTypes.object.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canSuggest: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
}
export default RuleOption
