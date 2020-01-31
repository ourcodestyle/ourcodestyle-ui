import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import {Spinner} from '@blueprintjs/core'

const INITIAL_STATE = { loading: true, error: null }

class QueryComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = INITIAL_STATE
  }

  componentDidMount() {
    this.startLoadQuery()
  }

  queryOptions(){
    return {
      errorPolicy: 'none'
    }
  }

  startLoadQuery(){
    this.loadQuery({ variables: this.queryVariables() })
  }

  loadQuery({ variables, isMore }){
    const client = this.context.client
    const query = gql(this.query())
    var queryOptions = this.queryOptions()

    try {
        client.watchQuery({ query, variables, ...queryOptions }) // performs query as well
          .subscribe(({data, loading, error, errors, networkStatus}) => {
            // window.console.log("query subscribe fired")
            if (loading) return
            if (error) {
              this.queryFailed({error, errors, networkStatus})
            } else {
              if (isMore){
                this.moreQueryLoaded(data)
              } else {
                this.queryLoaded(data)
              }
            }

            if (this.state.loading) {
              this.setState({loading: false})
            }
        }, (error) => {
          window.console.log("Query Failed")
          window.console.dir(error)
          this.queryFailed({error})
        })


    } catch(error) {
      console.log('query error')
      console.log(error)
      this.setState({
        loading: false,
        error
      })
    }
  }

  query(){
    throw "query() should be redefined on extended component"
  }

  queryVariables(){
    return {}
  }

  loading(){
    return <Spinner />
  }

  queryLoaded(data){
    this.setState(data)
  }

  queryFailed({error}) {
    this.setState({
      loading: false,
      error
    })
  }

  handleError(error){
    const message = error.message
    return <div>{message}</div>
  }

  render(){
    const { loading, error } = this.state
    if (loading) return this.loading()
    if (error) return this.handleError(error)
    return this.content()
  }
}

QueryComponent.contextTypes = {
  client: PropTypes.object
}

export default QueryComponent
