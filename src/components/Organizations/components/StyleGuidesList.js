import React from 'react'
import PropTypes from 'prop-types'
import { Map, List } from 'immutable'
import { Link } from 'react-router-dom'

class StyleGuidesList extends React.Component {

  componentDidMount() {
  }

  render() {
    const { list } = this.props

    return <div>
        <table className="pt-html-table">
          <thead>
            <tr>
              <th>Language</th>
              <th>Guide Name</th>
              <th>Rules Num</th>
            </tr>
          </thead>
          <tbody>
            { list.map((styleGuide,i) =>
                <tr key={i}>
                  <td>{styleGuide.language}</td>
                  <td>
                    <Link to={`/organizations/${styleGuide.organizationDomain}/style-guides/${styleGuide.id}`}>
                      {styleGuide.name}
                    </Link>
                  </td>
                  <td>{styleGuide.rulesCount}</td>
                </tr>
              )
            }
          </tbody>
        </table>
    </div>
  }
}

// StyleGuidesList.propTypes = {
//   list: PropTypes.instanceOf(List),
// }

export default StyleGuidesList