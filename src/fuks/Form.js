import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import { FormContext } from '~/contexts'
import { mutationSuccess } from '~/redux/globalActions'
import gql from 'graphql-tag'
import _ from 'lodash'
import { parseErrorMessage } from '~/utils/apiUtils'

class Form extends React.Component {

  constructor(props) {
    super(props)
    const stateConfig = this.buildConfig(props)
    this.state = stateConfig
  }

  buildConfig(props){
    const { children, forRecord: record, onSubmit, extraQuery, extraQueryFragments } = props

    let { action, mutationAction } = props

    if (onSubmit){
      this.onSubmit = onSubmit.bind(this)
    }

    const recordType = record["__typename"]

    const hasChildren = (el) => el && el.props && el.props.children && el.props.children
    const getAllChildren = (cs) => {
      cs = _.castArray(cs)
      return _.flatMap(cs, c => hasChildren(c) ?
        [c].concat(getAllChildren(c.props.children)) : [c] )
    }

    const allChildren = getAllChildren(children)

    let fields = _.map(_.reject(allChildren, el => !el || !el.props || _.isEmpty(el.props.field)), (el) => {
      const fieldNameAndType = el.props.field
      const [name, type] = _.split(fieldNameAndType, ' ')
      const inputType = el.props.as || 'text'
      const dataType = _.split(type, "!")[0]
      const isRequired = _.endsWith(type, "!")

      return { name, type, isRequired, inputType, dataType }
    })
console.log('fields');
console.dir(fields);
    if (!action) {
      if (record.id){
        action = 'update'
        fields = [{name: 'id', type: 'ID!'}].concat(fields)
      } else {
        action = 'create'
      }
    } else if (action == 'delete') {
      fields = [{name: 'id', type: 'ID!'}].concat(fields)
    }

    const fieldNames = _.map(fields, 'name')

    // Empty form with each key as empty string
    let form = _.zipObject(fieldNames, _.times(fieldNames.length, () => ""))

    form = _.merge(_.pick(form, fieldNames), _.pick(record, fieldNames))

    const fieldsConfig = _.mapValues(_.groupBy(fields, 'name'), fs => fs[0])

    return {
      fieldNames,
      fieldsConfig,
      recordType,
      action,
      fields,
      form,
      extraQuery,
      extraQueryFragments,
      errors: [],
      loading: false,
      mutationAction,
    }
  }



  mutationAction(){
    if (this.state.mutationAction) {
      return this.state.mutationAction;
    } else {
      return `${this.state.action}${_.upperFirst(_.camelCase(this.state.recordType))}`
    }
  }

  action(){
    return this.props.action || (this.props.forRecord.id ? 'update' : 'create')
  }

  buildRequest(){
    // like: $id: ID!, name: String!, description: String
    const signature = this.state.fields.map(({name, type}) => `$${name}: ${type}`).join(', ')
    // like: ruleUpdate
    const mutationAction = this.mutationAction()
    // like: id: $id, name: $name, description: $description
    const mutationArguments = this.state.fields.map(({name}) => `${name}: $${name}`)
    // like:
    //    id
    //    name
    //    description
    let returnFields = _.map(this.state.fields, 'name').join("\n")
    if (this.action() == 'create'){
      returnFields = ['id'].concat(returnFields)
    }
    // can also fetch additional data, like
    const extraQuery = this.state.extraQuery || ""
    const extraQueryFragments = this.state.extraQueryFragments || []
    // like:
    //  errors
    const metaFields = `errors {
        field
        messages
      }`

    const gqlString = `
      mutation (${signature}) {
        ${mutationAction}(${mutationArguments}){
          ${returnFields}
          ${extraQuery}
          ${metaFields}
        }
      }
      ${extraQueryFragments.join("\n")}
    `

    return gql(gqlString)
  }

  buildVariables() {
    let valuesForConrolledFields = {}
    _.each(this.inputs(), (el) => {
      // const fieldNameAndType = el.props.field
      const [name, _type] = _.split(el.props.field, ' ')
      // const inputType = el.props.as || 'text'
      if (el.props.hasOwnProperty('value')) {
        valuesForConrolledFields[name] = el.props.value
      }
    })

    const fieldNames = this.state.fieldNames
    const emptyVariables = _.zipObject(fieldNames, _.times(fieldNames.length, () => ""))
    return _.merge(
      emptyVariables,
      _.pick(this.state.form, fieldNames),
      _.pick(valuesForConrolledFields, fieldNames)
    )
  }

  // recursively collect all children
  descendants() {
    const hasChildren = (el) => el && el.props && el.props.children && el.props.children.length > 0
    const getAllChildren = (cs) => {
      return _.flatMap(cs, c => hasChildren(c) ?
        [c].concat(getAllChildren(c.props.children)) : [c] )
    }
    return getAllChildren(this.props.children)
  }

  inputs() {
    return _.reject(this.descendants(), el => !el.props || _.isEmpty(el.props.field))
  }

  runRequest() {
    const { client: apolloClient, onSuccess, onFailure, dispatch, dontResetFieldsOnSubmit } = this.props

    const mutation = this.buildRequest()
    const variables = this.buildVariables()

    this.setState({loading: true})
    apolloClient.mutate({
      mutation,
      variables,
    }).then(result => {
      this.setState({loading: false})
      const data = result.data[this.mutationAction()]

      if (data.errors.length === 0){
        dispatch(mutationSuccess({ action: this.mutationAction(), data }))
        !dontResetFieldsOnSubmit && this.resetFields()
        onSuccess && onSuccess(data)
      } else {
        this.setState({errors: data.errors})
        onFailure && onFailure(data)
      }
    }).catch(error => {
      const message = parseErrorMessage(error) || 'Something went wrong'
      this.setState({errors: [{ message }] })
      this.setState({loading: false})
    })
  }

  defaultOnSubmit(){
    this.runRequest()
  }

  resetFields(){
    const fieldsToReset = _.filter(this.state.fields, x => _.includes(['text', 'textarea'], x.inputType) )
    const form = _.fromPairs(_.map(fieldsToReset, x => [x.name, ""]))
    this.setState({ form: Object.assign({}, this.state.form, form) })
  }

  render(){
    const { form, errors, loading, fieldToType } = this.state
    const { onChange } = this.props

    const onSubmit = this.onSubmit || this.defaultOnSubmit.bind(this)

    const onChangeField = (fieldName) => (event) => {
      const fieldConfig = this.state.fieldsConfig[fieldName]
      let value = event.target.value

      if (fieldConfig.dataType === "Int" && value.length > 0) {
        value = parseInt(value)
      }

      if (fieldConfig.dataType === "Boolean" && fieldConfig.inputType === "switch") {
        value = event.target.checked
      }

      this.setState({ form: Object.assign({}, form,  { [fieldName]: value } ) })
      onChange && onChange(fieldName, value)
    }

    return <FormContext.Provider value={{
              form,
              onChangeField,
              onSubmit,
              errors,
              loading
            }}
          >
          {this.props.children}
    </FormContext.Provider>
  }
}

Form.propTypes = {
  // fields: PropTypes.array
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  onChange: PropTypes.func,
}

export default compose(
  connect(),
  withApollo
)(Form)
