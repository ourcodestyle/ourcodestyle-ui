import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import {
  Tab,
  Tabs,
} from '@blueprintjs/core'
import _ from 'lodash'

class ParamsSelector extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      displayParams: _.reject(props.rule.params, 'isSwitch')
    }
  }

  render() {
    // if (this.props.rule.linter === "eslint") {
    //   return this.argumentsSelector()
    // } else {
    return this.optionsSelector()
    // }
  }

  optionsSelector() {
    let { displayParams } = this.state
    const { rule, history } = this.props

    if (displayParams.length === 0) return null

    displayParams = _.sortBy(displayParams, 'id')

    // const buildTabTitle = (option) => {
    //   return <div style={{ width: '100%', textAlign: 'left' }}>
    //     <div style={{float: 'right', marginLeft: 10}}> &rarr; </div>
    //     {option.name}
    //   </div>
    // }

    const openParam = (id) => {
      const location = `/projects/${rule.styleGuide.project.domain}/style-guides/${rule.styleGuide.id}/rules/${rule.id}/${id}`
      history.push(location)
    }

    // return null
    // onClick={() => openParam(option.id)}
    return <div>
      <h2>Rule Params</h2>
      <Tabs id="ParamSelector" onChange={id => openParam(id)} large vertical selectedTabId={this.props.paramId}>
        {/* <Tab id="test" title="Test" /> */}
        {displayParams.map(option => <Tab key={option.id} id={option.id} title={option.name} />)}
        {/* { displayParams.map(option => <Tab key={option.id} id={option.id} title={buildTabTitle(option)} /> ) } */}
      </Tabs>
    </div>
  }

  // argumentsSelector() {
  //   let { displayParams } = this.state
  //   const { rule, optionId, history } = this.props

  //   if (displayParams.length === 0) return null

  //   displayParams = _.sortBy(displayParams, 'id')

  //   const openOption = (optionId) => {
  //     const location = `/projects/${rule.styleGuide.project.domain}/style-guides/${rule.styleGuide.id}/rules/${rule.id}/${optionId}`
  //     history.push(location)
  //   }

  //   const nodes = rule.arguments.map(argument => {
  //     const childNodes = argument.options.map(option => {
  //     const label = <span style={{cursor: 'pointer'}} onClick={() => openOption(option.id)}>{option.name} <span style={{color: '#aaa'}}>({option.kind})</span></span>
  //       return {
  //         id: option.id,
  //         label,
  //         icon: "dot",
  //         isSelected: optionId === option.id,
  //       }
  //     })
  //     return {
  //       id: argument.id,
  //       label: `${argument.kind}`,
  //       isExpanded: true,
  //       childNodes
  //     }
  //   })

  //   return <div>
  //     <h2>Rule Options</h2>

  //     <Tree
  //       contents={nodes}
  //       className={Classes.ELEVATION_0}
  //     />
  //   </div>
  // }
}

ParamsSelector.propTypes = {
  rule: PropTypes.object,
  params: PropTypes.array,
  paramId: PropTypes.string,
  history: PropTypes.object,
}

export default withRouter(ParamsSelector)
