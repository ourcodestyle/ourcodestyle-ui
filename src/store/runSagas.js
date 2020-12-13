import GlobalSagas from '~/redux/globalSagas'
import SignUpPageSagas from '~/components/SignUpPage/redux/sagas'
import ProjectsSagas from '~/components/Projects/redux/sagas'
import StyleGuidesSagas from '~/components/StyleGuides/redux/sagas'
import RulesSagas from '~/components/Rules/redux/sagas'

export const runSagas = (sagaMiddleware) => {
  sagaMiddleware.run(GlobalSagas)
  sagaMiddleware.run(SignUpPageSagas)
  sagaMiddleware.run(ProjectsSagas)
  sagaMiddleware.run(StyleGuidesSagas)
  sagaMiddleware.run(RulesSagas)
}

export default runSagas
