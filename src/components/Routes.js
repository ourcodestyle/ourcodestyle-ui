/* eslint-disable import/no-named-as-default */
import React from 'react'
import PropTypes from 'prop-types'

import {
  Switch,
  NavLink,
  Route,
  withRouter
} from 'react-router'

import {fConnect} from '~/utils/components'

import Header from './Header'
import Footer from './Footer'
import NotFoundPage from './NotFoundPage'

import HomePage from './HomePage'
import Explore from './Explore'
import Dashboard from './Dashboard'

import SignUpPage from './SignUpPage/SignUpPage'

import AuthPage from './AuthPage'
import AuthCallbackPage from './AuthCallbackPage'
import AuthLinkPage from './AuthLinkPage'

import OrganizationsIndex from './Organizations/Index'
import OrganizationsShow from './Organizations/Show'

import StyleGuidesNew from './StyleGuides/New'
import StyleGuidesShow from './StyleGuides/Show'
import LandingGuide from './StyleGuides/LandingGuide'

import UserShow from './Users/Show'

import RulesShow from './Rules/Show'
import Modals from '~/modals'

import Playground from './Playground'

import RedirectPage from './Redirect'

import PrivacyPolicy from './Legal/PrivacyPolicy'
import TermsAndConditions from './Legal/TermsAndConditions'

class Routes extends React.Component {

  render() {
    return (
      <div>
        <div style={{ minHeight: 600 }}>
          <Header />
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/explore" component={Explore} exact />
            <Route path="/dashboard" component={Dashboard} exact />
            <Route path="/sign-up" component={SignUpPage} />

            <Route path="/redirect" component={RedirectPage} exact />

            {/* Linters */}
            <Route path="/rubocop" render={(props) => <LandingGuide {...props} slug="rubocop" />} exact />
            <Route path="/eslint"  render={(props) => <LandingGuide {...props} slug="eslint" />} exact />

            <Route path="/auth/:provider" component={AuthPage} exact />
            <Route path="/auth/:provider/callback" component={AuthCallbackPage} />
            <Route path="/authLink/:secret" component={AuthLinkPage} />

            {/* User */}
            <Route path="/users/:nickname" render={(props) => <UserShow nickname={props.match.params.nickname} />} exact />
            <Route path="/users/:nickname/:selectedTab" component={UserShow} exact />

            {/* Organization */}
            <Route path="/organizations" component={OrganizationsIndex} exact />
            <Route path="/organizations/:organizationDomain" component={OrganizationsShow} exact />
            <Route path="/organizations/:organizationDomain/dashboard" component={OrganizationsShow} exact />
            <Route path="/organizations/:organizationDomain/members" component={OrganizationsShow} exact />
            <Route path="/organizations/:organizationDomain/settings" component={OrganizationsShow} exact />

            {/* Rules */}
            <Route path="/organizations/:organizationDomain/style-guides/:styleGuideId/rules/:ruleId/:paramId?" component={RulesShow} />
            {/* <Route path="/organizations/:organizationDomain/style-guides/:styleGuideId/rules/:ruleId" exact component={RulesShow} /> */}
            <Route path="/organizations/:organizationDomain/style-guides/new" component={StyleGuidesNew} exact />
            <Route path="/organizations/:organizationDomain/style-guides/:styleGuideId" component={StyleGuidesShow} />

            {/* Legal */}
            <Route path="/privacy-policy" exact component={PrivacyPolicy} />
            <Route path="/terms-and-conditions" exact component={TermsAndConditions} />

            {/* Playground */}
            <Route path="/playground" exact component={Playground} />

            <Route component={NotFoundPage} />
          </Switch>
          <Modals />
        </div>
        <Footer />
      </div>
    )
  }
}

Routes.propTypes = {
  location: PropTypes.object
}
// export default withRouter(Routes)
export default Routes
