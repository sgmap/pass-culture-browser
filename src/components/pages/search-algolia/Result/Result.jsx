import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'

import { formatRecommendationDates } from '../../../../utils/date/date'
import { getHumanizeRelativeDistance } from '../../../../utils/geolocation'
import Icon from '../../../layout/Icon/Icon'

const Result = ({ result, geolocation, search }) => {
  const { _geoloc = {}, objectID, offer } = result
  const { dateRange, departementCode, id: offerId, label, name, thumbUrl } = offer
  const { latitude : userLatitude, longitude: userLongitude } = geolocation
  const { lat: venueLatitude, lng: venueLongitude } = _geoloc

  return (
    <Link
      key={objectID}
      to={`/recherche-algolia/details/${offerId}${search}`}
    >
      <div className="result">
        <img
          alt=""
          className="result-image"
          src={thumbUrl}
        />
        <div className="result-container">
          <h1 className="result-title">
            {name}
          </h1>
          <label className="result-type">
            {label}
          </label>
          <label className="result-date">
            {formatRecommendationDates(
              departementCode,
              dateRange
            )}
          </label>
          <label className="result-distance">
            {getHumanizeRelativeDistance(
              userLatitude,
              userLongitude,
              venueLatitude,
              venueLongitude
            )}
          </label>
        </div>
        <div className="result-arrow">
          <Icon
            className="teaser-arrow-img"
            svg="ico-next-S"
          />
        </div>
      </div>
    </Link>
  )
}

Result.defaultProps = {
  geolocation: {},
  result: {},
}

Result.propTypes = {
  geolocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  result: PropTypes.shape({
    _geoloc: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
    offer: PropTypes.shape({
      dateRange: PropTypes.arrayOf(PropTypes.string),
      departementCode: PropTypes.number,
      id: PropTypes.string,
      label: PropTypes.string,
      name: PropTypes.string,
      thumbUrl: PropTypes.string,
    }),
    objectID: PropTypes.string,
  }),
  search: PropTypes.string.isRequired
}

export default Result
