import Raven from 'raven-js'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { version } from '../package.json'
import { API_URL, IS_DEV } from './utils/config'

import './styles/index.scss'
import 'typeface-barlow'

import Root from './Root'
import store from './utils/store'
import registerCacheWorker from './workers/cache'
import registerDexieWorker from './workers/dexie/register'

if (!IS_DEV) {
  Raven
  .config(API_URL+'/client_errors', {
    release: version,
    environment: process.env.NODE_ENV,
    logger: 'javascript'})
    .install()
}

const initApp = () => {

  ReactDOM.render(<Root />, document.getElementById('root'))
  if (module.hot) {
    module.hot.accept('./Root', () => {
      const NextRoot = require('./Root').default
      ReactDOM.render(
        <AppContainer>
          <NextRoot />
        </AppContainer>,
        document.getElementById('root')
      )
    })
  }
  registerCacheWorker()
  registerDexieWorker(store)
}

if (window.cordova) {
  document.addEventListener("deviceready", initApp, false);
} else {
  initApp()
}
