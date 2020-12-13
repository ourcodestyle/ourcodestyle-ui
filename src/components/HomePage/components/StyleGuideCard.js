import React from 'react'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'
import { Link } from 'react-router-dom'
import { Button, Card, Elevation } from "@blueprintjs/core"

const LanguagesWithCovers = ['ruby']

class StyleGuideCard extends React.Component {

  componentDidMount() {
  }

  render() {
    const { id, name, language, project } = this.props

    let converImageUrl = "/images/style-guide-covers/default.png"

    if (LanguagesWithCovers.indexOf(language) != -1){
      converImageUrl =  "/images/style-guide-covers/ruby-language.png"
    }

    return <Card elevation={Elevation.TWO} style={{textAlign: 'center' }}>
      <Link to={`/projects/${project.domain}/style-guides/${id}`}>
        <img src={converImageUrl} style={{width: 200}} />
        <h5 style={{ marginTop: 20 }}>{name}</h5>
      </Link>
      Project: <Link to={`/projects/${project.domain}`}>{project.name}</Link>
    </Card>
  }
}

StyleGuideCard.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  projectDomain: PropTypes.string
}

export default StyleGuideCard
