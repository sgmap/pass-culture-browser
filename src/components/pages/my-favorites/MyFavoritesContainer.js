import { connect } from 'react-redux'
import { compose } from 'redux'
import { requestData } from 'redux-saga-data'

import { withRequiredLogin } from '../../hocs'
import MyFavorites from './MyFavorites'
import { selectMyFavorites } from '../../../selectors'

export const mapStateToProps = state => {
  const myFavorites = selectMyFavorites(state)
  return { myFavorites }
}

export const mapDispatchToProps = dispatch => ({
  getMyFavorites: (handleFail, handleSuccess) => {
    dispatch(
      requestData({
        apiPath: '/favorites',
        handleFail,
        handleSuccess,
        stateKey: 'favorites',
      })
    )
  },
})

export default compose(
  withRequiredLogin,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MyFavorites)
