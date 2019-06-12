import PropTypes from 'prop-types'
import React from 'react'

import SearchPicture from '../SearchPicture'

const NavByOfferType = ({
  title,
  categories,
  resetSearchStore,
  updateSearchQuery,
}) => (
  <div id="nav-by-offer-type">
    <h2 className="is-italic fs15">{title}</h2>
    <div className="pc-list flex-columns wrap-2">
      {categories.map(category => (
        <button
          className="item no-border no-background no-outline mt12 col-1of2"
          key={category}
          onClick={() => {
            resetSearchStore()
            updateSearchQuery(category)
          }}
          type="button"
        >
          <SearchPicture category={category} />
        </button>
      ))}
    </div>
  </div>
)

NavByOfferType.propTypes = {
  categories: PropTypes.array.isRequired,
  resetSearchStore: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  updateSearchQuery: PropTypes.func.isRequired,
}

export default NavByOfferType
