import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


export const actionsConnect = (actions) => {
  const mapStateToProps = () => ({})
  return fConnect(mapStateToProps, actions)
}

export const fConnect = (mapStateToProps, actions = {}) => {
  if (typeof(mapStateToProps) == 'object'){
    actions = mapStateToProps
    mapStateToProps = () => ({})
  }

  return connect(
    mapStateToProps,
    dispatch => ({ actions: bindActionCreators(actions, dispatch) })
  )
}
