import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { NavLink } from 'react-router-dom'

const FormFooter = ({ isLoading, isSubmit }) => (
  <footer>
    <NavLink
      className="signup-footer-link"
      to="/connexion"
    >
      {'J’ai déjà un compte'}
    </NavLink>
    <button
      className={classnames('signup-footer-button', {
        'is-loading': isLoading,
      })}
      disabled={!isSubmit}
      type="submit"
    >
      {'Créer'}
    </button>
  </footer>
)

FormFooter.defaultProps = {
  isLoading: false,
  isSubmit: false,
}

FormFooter.propTypes = {
  isLoading: PropTypes.bool,
  isSubmit: PropTypes.bool,
}

export default FormFooter
