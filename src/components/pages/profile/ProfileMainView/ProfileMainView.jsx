import PropTypes from 'prop-types'
import React from 'react'

import { version } from '../../../../../package.json'
import ProfileHeader from '../ProfileHeader/ProfileHeader'
import RelativeFooterContainer from '../../../layout/RelativeFooter/RelativeFooterContainer'
import MesInformationsContainer from '../MesInformations/MesInformationsContainer'
import RemainingCredit from '../RemainingCredit/RemainingCredit'

const ProfileMainView = ({ currentUser }) => (
  <div
    className="pc-page-view pc-theme-default flex-rows with-header"
    id="profile-page-main-view"
  >
    <main className="pc-main is-clipped is-relative">
      <div className="pc-scroll-container">
        <ProfileHeader currentUser={currentUser} />
        {currentUser && <RemainingCredit currentUser={currentUser} />}
        <MesInformationsContainer />
        <div className="app-version">
          {`Version ${version}`}
        </div>
        <img
          alt=""
          className="pm-ministry-of-culture"
          src="/min-culture-rvb@2x.png"
          width="161"
        />
      </div>
    </main>
    <RelativeFooterContainer
      extraClassName="dotted-top-red"
      theme="white"
    />
  </div>
)

ProfileMainView.propTypes = {
  currentUser: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape()]).isRequired,
}

export default ProfileMainView
