import React from 'react'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import {compose} from 'redux'
import Storage from '~/services/storage'


class RedirectPage extends React.Component {

  componentDidMount() {
    const history = this.props.history
    const returnTo = Storage.get('returnTo')
    if (returnTo) {
      const doRedirect = Storage.get('doRedirect')
      if (doRedirect){
        Storage.remove('doRedirect')
        Storage.remove('returnTo')
        history.push(returnTo)
      } else {
        Storage.set('doRedirect', true)
        window.location.reload()
      }
    } else {
      history.push('/')
    }
  }

  render(){
    return <div>
      Redirecting ...
    </div>
  }

}

export default compose(withApollo, withRouter)(RedirectPage)