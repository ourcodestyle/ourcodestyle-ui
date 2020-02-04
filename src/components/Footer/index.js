import React from 'react'
import { Link } from 'react-router-dom'
import {Classes} from '@blueprintjs/core'

class Footer extends React.Component {

  render(){
    return <div className="footer">
      <div style={{ display: 'grid', gridTemplateColumns: "200px 200px 1fr" }}>
        <div>
          <h3>Help</h3>
          <ul className={Classes.LIST + " links-list"}>
            <li></li>
            <li>
              <a href="https://github.com/ourcodestyle/ourcodestyle-root/issues" target="_blank">
                Issues & Proposals
              </a>
            </li>
            <li>
              <a href="https://github.com/ourcodestyle/ourcodestyle-root" target="_blank">
                Contribute
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3>Legal & Privacy</h3>
          <ul className={Classes.LIST + " links-list"}>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms</Link></li>
          </ul>
        </div>

        <div></div>
      </div>

      <div style={{ fontSize: 12, marginTop: 20, marginBottom: 10, textAlign: 'right' }}>
        Made by <a href="https://github.com/fuksito" target="_blank">@fuksito</a> in Kyiv
      </div>

    </div>
  }

}

export default Footer
