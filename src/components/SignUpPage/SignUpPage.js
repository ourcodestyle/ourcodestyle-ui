import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  Input,
  Button
} from '@blueprintjs/core'

// Since this component is simple and static, there's no parent container for it.
const SignUpPage = ({form, actions}) => {
  
  const handleChange = name => event => {
    actions.fieldChange(name, event.target.value)
  }

  return <div>
      <h1>Sign Up</h1>
    </div>
}

import * as actions from './redux/actions'

const mapStateToProps = ({ SignUpPage }) => ({ form: SignUpPage.toJS() })

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage)
// export default SignUpPage
