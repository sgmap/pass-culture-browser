import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'

import BookingCancellation from './BookingCancellation'
import { selectBookingByRouterMatch } from '../../../redux/selectors/data/bookingsSelectors'
import { selectOfferByRouterMatch } from '../../../redux/selectors/data/offersSelectors'
import withPageTracking from '../../../tracking/withPageTracking'

export const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const offer = selectOfferByRouterMatch(state, match)
  const booking = selectBookingByRouterMatch(state, match)

  return {
    booking,
    offer,
  }
}

export default compose(
  withPageTracking,
  withRouter,
  connect(mapStateToProps)
)(BookingCancellation)
