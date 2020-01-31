import React from 'react'
import ReactMarkdown from 'react-markdown'
import Code from '~/pure/Code'

class Markdown extends React.Component {

  render(){
    const { source } = this.props

    return <ReactMarkdown
      source={source}
      renderers={{ code: Code }}
      className="markdown"
    />
  }
}

export default Markdown