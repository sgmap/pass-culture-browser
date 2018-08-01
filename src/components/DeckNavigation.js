import { Icon } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import Clue from './Clue'
import currentRecommendationSelector from '../selectors/currentRecommendation'
import { ROOT_PATH } from '../utils/config'


const DeckNavigation = ({
  currentRecommendation,
  flipHandler,
  handleGoNext,
  handleGoPrevious,
}) => {
  const { headerColor } = (currentRecommendation || {})
  const backgroundGradient = `linear-gradient(to bottom, rgba(0,0,0,0) 0%,${headerColor || '#000'} 30%,${headerColor || '#000'} 100%)`
  return (
    <div id="deck-navigation" style={{ background: backgroundGradient }}>
      <div
        className="controls flex-columns wrap-3"
        style={{ backgroundImage: `url('${ROOT_PATH}/mosaic-w@2x.png')` }}
      >
        {/* previous button */}
        {(handleGoPrevious && (
          <button
            type="button"
            className="button before"
            onClick={handleGoPrevious}
          >
            <Icon svg="ico-prev-w-group" alt="Précédent" />
          </button>
        )) || <span />}
        {/* flip button */}
        {(flipHandler && (
          <div className="flex-rows">
            <button
              type="button"
              onClick={flipHandler}
              onDragLeave={flipHandler}
              className="button to-recto"
            >
              <Icon svg="ico-slideup-w" alt="Plus d'infos" />
            </button>
            <Clue />
          </div>
        )) || <span />}
        {/* next button */}
        {(handleGoNext && (
          <button type="button" className="button after" onClick={handleGoNext}>
            <Icon svg="ico-next-w-group" alt="Suivant" />
          </button>
        )) || <span />}
      </div>
    </div>
  )
}

DeckNavigation.defaultProps = {
  currentRecommendation: null,
  flipHandler: null,
  handleGoNext: null,
  handleGoPrevious: null,
}

DeckNavigation.propTypes = {
  currentRecommendation: PropTypes.object,
  flipHandler: PropTypes.func,
  handleGoNext: PropTypes.func,
  handleGoPrevious: PropTypes.func,
}

export default compose(
  withRouter,
  connect((state, ownProps) => {
    const { mediationId, offerId } = ownProps.match.params
    return {
      currentRecommendation: currentRecommendationSelector(state, offerId, mediationId)
    }
  })
)(DeckNavigation)
