import get from 'lodash.get'
import createCachedSelector from 're-reselect';

import recommendationSelector from './recommendation'

export default createCachedSelector(
  state => state.data.bookings,
  (state, recommendationId) => recommendationSelector(state, recommendationId),
  (bookings, recommendation) => {
    return bookings.find(b => get(b, 'recommendationId') === get(recommendation, 'id'))
  }
)(
  (state, recommendationId) => recommendationId || ''
)
