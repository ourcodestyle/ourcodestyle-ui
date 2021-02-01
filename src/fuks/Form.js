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
    this.state = this.buildConfig(props)
    console.log('form config');
    console.dir(this.state);
  }

  buildConfig(props) {
    const { children, forRecord: record, onSubmit, extraQuery, extraQueryFragments } = props

    let { action, mutationAction } = props

    if (onSubmit) {
      this.onSubmit = onSubmit.bind(this)
    }

    const recordType = record["__typename"]

    const hasChildren = (el) => el && el.props && el.props.children && el.props.children
    const getAllChildren = (cs) => {
      cs = _.castArray(cs)
      return _.flatMap(cs, c => hasChildren(c) ?
        [c].concat(getAllChildren(c.props.children)) : [c])
    }

    const allChildren = getAllChildren(children)

    let fieldsConfig = {}
    _.each(_.reject(allChildren, el => !el || !el.props || _.isEmpty(el.props.field)), (el) => {
      const fieldNameAndType = el.props.field
      const [name, type] = _.split(fieldNameAndType, ' ')
      if (!fieldsConfig[name]) {
        const isRequired = _.endsWith(type, "!")
        const isArray = _.startsWith(type, '[')
        const dataType = _.split(type, "!")[0]
        const inputType = el.props.as || 'text'
        const notReturnable = el.props.notReturnable

        fieldsConfig[name] = {
          name,
          type,
          isRequired,
          isArray,
          inputType,
          dataType,
          notReturnable
        }
      }
    })
    // let fields = Object.values(fieldsConfig)

    if (!action) {
      if (record.id) {
        action = 'update'
      } else {
        action = 'create'
      }
    }

    if (action === 'update' || action === 'delete') {
      fieldsConfig['id'] = { name: 'id', type: 'ID!' }
    }

    // if (action == 'update') {
    //   fieldsConfig['id'] = { name: 'id', type: 'ID!' }
    // } else if (action == 'delete') {
    //   fieldsConfig['id'] = { name: 'id', type: 'ID!' }
    // }

    const fieldNames = Object.keys(fieldsConfig)

    // Empty form with each key as empty string
    // let form = _.zipObject(fieldNames, _.times(fieldNames.length, () => ""))
    let form = {}
    // debugger
    _.each(fieldsConfig, (config, name) => {
      if (config.isArray) {
        form[config.name] = []
      } else {
        form[config.name] = ""
      }
    })

    console.log('form');
    console.dir(form);
    console.log('_.pick(record, fieldNames)')
    console.dir(_.pick(record, fieldNames))

    form = _.merge(form, _.pick(record, fieldNames))

    // const fieldsConfig = _.mapValues(_.groupBy(fields, 'name'), fs => fs[0])
    const fields = Object.values(fieldsConfig)

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



  mutationAction() {
    if (this.state.mutationAction) {
      return this.state.mutationAction;
    } else {
      return `${this.state.action}${_.upperFirst(_.camelCase(this.state.recordType))}`
    }
  }

  action() {
    return this.props.action || (this.props.forRecord.id ? 'update' : 'create')
  }

  buildRequest() {
    // like: $id: ID!, name: String!, description: String
    const signature = this.buildSignature()
    // like: ruleUpdate
    const mutationAction = this.mutationAction()
    // like: id: $id, name: $name, description: $description
    const mutationArguments = this.buildArguments()
    // like:
    //    id
    //    name
    //    description

    const returnableFields = _.reject(this.state.fields, 'notReturnable')
    let returnFieldsList = _.map(returnableFields, 'name')
    if (this.state.action === 'create') {
      returnFieldsList = ['id'].concat(returnFieldsList)
    }
    let returnFields = returnFieldsList.join("\n")

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

  buildSignature() {
    const fields = _.uniqBy(this.state.fields, f => f.name)
    return fields.map(({ name, type }) => `$${name}: ${type}`).join(', ')
  }

  buildArguments() {
    const names = _.uniq(this.state.fields.map(({ name }) => name))
    const list = names.map((name) => `${name}: $${name}`)

    return list
  }

  buildVariables() {
    return this.state.form

    // let valuesForConrolledFields = {}
    // _.each(this.inputs(), (el) => {
    //   // const fieldNameAndType = el.props.field
    //   const [name, _type] = _.split(el.props.field, ' ')
    //   // const inputType = el.props.as || 'text'
    //   if (el.props.hasOwnProperty('value') && el.props.as === 'switch') {
    //     valuesForConrolledFields[name] = el.props.value
    //   }
    // })

    // debugger
    // console.log('this.state.form');
    // console.dir(this.state.form);

    // const fieldNames = this.state.fieldNames
    // const emptyVariables = _.zipObject(fieldNames, _.times(fieldNames.length, () => ""))
    // return _.merge(
    //   emptyVariables,
    //   _.pick(this.state.form, fieldNames),
    //   // _.pick(valuesForConrolledFields, fieldNames)
    // )
  }

  // recursively collect all children
  descendants() {
    const hasChildren = (el) => el && el.props && el.props.children && el.props.children.length > 0
    const getAllChildren = (cs) => {
      return _.flatMap(cs, c => hasChildren(c) ?
        [c].concat(getAllChildren(c.props.children)) : [c])
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

    this.setState({ loading: true })
    apolloClient.mutate({
      mutation,
      variables,
    }).then(result => {
      this.setState({ loading: false })
      const data = result.data[this.mutationAction()]

      if (data.errors.length === 0) {
        dispatch(mutationSuccess({ action: this.mutationAction(), data }))
        !dontResetFieldsOnSubmit && this.resetFields()
        onSuccess && onSuccess(data)
      } else {
        this.setState({ errors: data.errors })
        onFailure && onFailure(data)
      }
    }).catch(error => {
      const message = parseErrorMessage(error) || 'Something went wrong'
      this.setState({ errors: [{ message }] })
      this.setState({ loading: false })
    })
  }

  defaultOnSubmit() {
    this.runRequest()
  }

  resetFields() {
    const fieldsToReset = _.filter(this.state.fields, x => _.includes(['text', 'textarea'], x.inputType))
    const form = _.fromPairs(_.map(fieldsToReset, x => [x.name, ""]))
    this.setState({ form: Object.assign({}, this.state.form, form) })
  }

  render() {
    const { form, errors, loading, fieldsConfig } = this.state
    const { onChange } = this.props

    const onSubmit = this.onSubmit || this.defaultOnSubmit.bind(this)

    const setFormField = (form, fieldName, value) => {
      return Object.assign({}, form, { [fieldName]: value })
    }

    const onChangeField = (fieldName) => (event) => {
      const {
        dataType,
        inputType,
        isArray
      } = this.state.fieldsConfig[fieldName]
      // console.log('this.state');
      // console.dir(this.state);
      // debugger
      let value = event.target.value

      if (dataType === "Int" && value.length > 0) {
        value = parseInt(value)
      }

      if (inputType === "switch") {
        if (isArray) {
          if (event.target.checked) {
            value = _.uniq(form[fieldName].concat(event.target.value))
          } else {
            value = _.without(form[fieldName], event.target.value)
          }
        } else if (dataType === "Boolean") {
          value = event.target.checked
        } else {
          value = event.target.value
        }
      }

      let newForm = setFormField(form, fieldName, value)

      if (onChange) {
        const changeResult = onChange(fieldName, value)
        if (changeResult && changeResult.setForm) {
          newForm = changeResult.setForm(newForm)
        }
      }


      this.setState({ form: newForm })
    }

    return <FormContext.Provider value={{
      form,
      onChangeField,
      onSubmit,
      errors,
      loading,
      fieldsConfig
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
