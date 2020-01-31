import React from 'react'
import PropTypes from 'prop-types'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/yaml/yaml'

class Code extends React.Component {

  render(){
    const { value, language, readOnly, onChange } = this.props

    // language
    let mode = language
    if (language === 'js') {
      mode = 'javascript'
    }

    return <CodeMirror
            value={value}
            options={{
              mode,
              theme: 'oceanic-next',
              lineNumbers: true,
              tabSize: 2,
              readOnly
            }}
            defineMode="Controlled"
            onBeforeChange={(editor, data, value) => {
              onChange({ target: {value} })
            }}
          />
  }
}

Code.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string
}

export default Code
