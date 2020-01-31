import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Intent,
  Callout,
  Icon,
} from '@blueprintjs/core'

import {
  RuboCopIcon,
  ESLintIcon,
} from '~/pure/linter-icons'


import { fConnect } from '~/utils/components'
import { compose } from 'redux'
import {
  withCurrentUser,
  withRouting,
 } from '~/contexts'

class HomePage extends React.Component {

  render() {
    const {
      currentUser,
      redirectTo,
    } = this.props
    return <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 120 }}>
        <div>
          <img src="/images/hello.png" style={{ width: 400, marginTop: 100, marginLeft: 100 }} />
          <div className="home-page-site-logo-credits" style={{marginLeft: 200}}>
            illustration by <a href="https://icons8.com" target="_blank">Ouch.pics</a>
          </div>
        </div>
        <div>
          <div style={{marginTop: 70}}>
            <div className="home-page-sitename">Our Code Style</div>
            <div className="home-page-siteslogan">Team up your code style consensus</div>
            <p className="home-page-site-short-description">
              Dicuss and vote for each style option with your teammates, get linter config based on your votes.
              Have fun when discovering style tastes of your colleagues.
            </p>
            { !currentUser.id && <Button onClick={redirectTo("/auth/github")} large text="Sign Up" intent={Intent.PRIMARY} style={{marginTop: 20, width: 200}} /> }
            {  currentUser.id && <Button onClick={redirectTo("/dashboard")} large text="Go to Dashboard" intent={Intent.SUCCESS} style={{marginTop: 20, width: 200}} /> }
          </div>
        </div>
      </div>

      <div>
        <Callout title={<div><Icon icon="code-block" style={{marginRight: 6, color: '#666'}} /><span>Supported Linters</span></div>} style={{textAlign: 'center'}}>
          <div style={{margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
            <div style={{ fontSize: '30px' }}>
              <Link to="/rubocop">
                <RuboCopIcon style={{ height: 25 }} /> RuboCop
              </Link>
            </div>
            <div style={{ fontSize: '30px' }}>
              <Link to="/eslint">
                <ESLintIcon style={{ height: 25 }} /> ESLint
              </Link>
            </div>
            <div style={{ fontSize: '30px' }}>
              Free Form
            </div>
          </div>
        </Callout>
      </div>

      <div style={{ marginTop: 50, textAlign: 'center' }}>
        <Button icon="search-around" large onClick={redirectTo("/explore")}>Explore Style Guides</Button>
      </div>

      {/* <div>
        <div className="home-page-site-how-it-works-title">How ourCodeStyle Works</div>
      </div> */}
    </div>
  }
}

const mapStateToProps = (state) => {
  console.log('state');
  console.dir(state);
  return {
  }
}
export default compose(
  // fConnect(mapStateToProps),
  withCurrentUser,
  // withRouter,
  withRouting,
)(HomePage)
