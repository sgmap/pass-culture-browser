import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { toast } from 'react-toastify'

import Icon from '../../../Icon/Icon'

const iconClass = isFavorite => `${isFavorite ? 'ico-like-filled' : 'ico-like-empty'}`

const alternativeText = isFavorite => (isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris')

const showFailModal = () => {
  toast.error('La gestion des favoris ne fonctionne pas pour le moment, réessaie plus tard.')
}

class Favorite extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { isWaitingApi: false }
  }

  componentDidMount() {
    const { loadFavorites } = this.props

    loadFavorites()
  }

  handleSuccess = () => {
    const { isFavorite, trackInFavorite } = this.props

    if (isFavorite) trackInFavorite()
    this.setState({ isWaitingApi: false })
  }

  handleFavorite = (offerId, mediationId, isFavorite) => () => {
    const { handleFavorite } = this.props

    this.setState(
      { isWaitingApi: true },
      handleFavorite(offerId, mediationId, isFavorite, showFailModal, this.handleSuccess)
    )
  }

  render() {
    const { isFavorite, mediationId, offerId } = this.props
    const { isWaitingApi } = this.state

    return (
      <button
        className="fav-button"
        disabled={isWaitingApi}
        onClick={this.handleFavorite(offerId, mediationId, isFavorite)}
        type="button"
      >
        <Icon
          alt={alternativeText(isFavorite)}
          svg={iconClass(isFavorite)}
        />
      </button>
    )
  }
}

Favorite.defaultProps = {
  isFavorite: true,
  mediationId: null,
}

Favorite.propTypes = {
  handleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
  loadFavorites: PropTypes.func.isRequired,
  mediationId: PropTypes.string,
  offerId: PropTypes.string.isRequired,
  trackInFavorite: PropTypes.func.isRequired,
}

export default Favorite
