import { combineReducers } from 'redux'
import { modals } from 'redux-react-modals'

import data, { lastRecommendationsRequestTimestamp } from './data'
import geolocation from './geolocation'
import menu from './menu'
import overlay from './overlay'
import share from './share'
import splash from './splash'
import token from './token'

const rootReducer = combineReducers({
  data,
  geolocation,
  lastRecommendationsRequestTimestamp,
  menu,
  modals,
  overlay,
  share,
  splash,
  token,
})

export default rootReducer
