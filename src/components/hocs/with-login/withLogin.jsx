import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { getCurrentUser } from '../../../redux/actions/currentUser'
import LoadingPage from '../../layout/LoadingPage/LoadingPage'

export default ({
  isRequired,
  handleSuccess = () => null,
  handleFail = () => null,
}) => WrappedComponent => {
  const _withLogin = props => {
    const { getCurrentUser, history, location } = props
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      getCurrentUser().then(({ value }) => {
        const isLoggedIn = !!value

        if (isLoggedIn) handleSuccess(value, history, location)
        else handleFail(history, location)

        if (!isRequired || isLoggedIn) setLoading(false)
      })
    }, [])

    return loading ? <LoadingPage /> : <WrappedComponent {...props} />
  }

  _withLogin.propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }).isRequired,
  }

  return compose(
    withRouter,
    connect(
      undefined,
      { getCurrentUser }
    )
  )(_withLogin)
}
