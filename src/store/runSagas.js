import GlobalSagas from '~/redux/globalSagas'
import SignUpPageSagas from '~/components/SignUpPage/redux/sagas'
import OrganizationsSagas from '~/components/Organizations/redux/sagas'
import StyleGuidesSagas from '~/components/StyleGuides/redux/sagas'
import RulesSagas from '~/components/Rules/redux/sagas'

export const runSagas = (sagaMiddleware) => {
  sagaMiddleware.run(GlobalSagas)
  sagaMiddleware.run(SignUpPageSagas)
  sagaMiddleware.run(OrganizationsSagas)
  sagaMiddleware.run(StyleGuidesSagas)
  sagaMiddleware.run(RulesSagas)
}

export default runSagas
