import get from 'lodash.get'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { selectCurrentUser } from 'with-react-redux-login'

import ShareButtonContent from './ShareButtonContent'
import { getShareURL } from '../../helpers'
import currentRecommendationSelector from '../../selectors/currentRecommendation'

const mapStateToProps = (state, ownProps) => {
  const { location } = ownProps
  const { mediationId, offerId } = ownProps.match.params
  const recommendation = currentRecommendationSelector(
    state,
    offerId,
    mediationId
  )
  const user = selectCurrentUser(state)
  const url = (user && getShareURL(location, user)) || null
  const offerName = get(recommendation, 'offer.name')
  const text = offerName && `Retrouvez ${offerName} sur le pass Culture`
  return { offerName, text, url, ...state.share }
}

export const ShareButton = compose(
  withRouter,
  connect(mapStateToProps)
)(ShareButtonContent)

export default ShareButton
