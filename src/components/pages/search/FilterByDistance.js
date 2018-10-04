import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

// hope that pass culture is just still playing on earth
const INFINITE_DISTANCE = 20000

const options = [
  {
    label: "Moins d'1 km",
    value: 1,
  },
  {
    label: 'Moins de 10 km',
    value: 10,
  },
  {
    label: 'Moins de 50 km',
    value: 50,
  },
  {
    label: 'Toutes distances',
    value: INFINITE_DISTANCE,
  },
]

class FilterByDistance extends Component {
  onChange = e => {
    const { filter, geolocation } = this.props

    const distance = e.target.value

    let { latitude, longitude } = geolocation
    if (distance === INFINITE_DISTANCE) {
      latitude = null
      longitude = null
    }

    filter.change({ distance, latitude, longitude })
  }

  render() {
    const { filter, title } = this.props

    // https://stackoverflow.com/questions/37946229/how-do-i-reset-the-defaultvalue-for-a-react-input
    // WE NEED TO MAKE THE PARENT OF THE KEYWORD INPUT
    // DEPENDING ON THE KEYWORDS VALUE IN ORDER TO RERENDER
    // THE IN PUT WITH A SYNCED DEFAULT VALUE
    const distanceKey = filter.query.distance === null ? 'empty' : 'not-empty'

    const distanceValue = filter.query.distance || 20000

    return (
      <div
        key={distanceKey}
        id="filter-by-distance"
        className="p12 mb12 text-center"
      >
        <h2 className="fs15 is-italic is-uppercase text-center mb12">
          {title}
        </h2>
        <select
          className="pc-selectbox pl24 py5 fs19 mb18"
          defaultValue={distanceValue}
          onChange={this.onChange}
          name="distance"
        >
          {options.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <hr className="dotted-bottom-primary" />
      </div>
    )
  }
}

FilterByDistance.propTypes = {
  filter: PropTypes.object.isRequired,
  geolocation: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
}

export default connect(state => ({ geolocation: state.geolocation }))(
  FilterByDistance
)
