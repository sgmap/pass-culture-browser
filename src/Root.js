import React, { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Route, Switch } from 'react-router-dom'

import App from './App'
import FeaturedBrowserRouterContainer from './components/router/FeaturedBrowserRouterContainer'
import MatomoPageTracker from './components/matomo/MatomoPageTracker'
import NotMatch from './components/pages/NotMatch'
import { removeHrefRoutes } from './components/router/utils'
import { configureStore } from './utils/store'

const { store, persistor } = configureStore()

const Root = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FeaturedBrowserRouterContainer
          render={routes => (
            <App routes={routes}>
              <Switch>
                {removeHrefRoutes(routes).map(route => (
                  <Route {...route} key={route.path} />
                ))}
                <Route component={NotMatch} />
              </Switch>
              <MatomoPageTracker />
            </App>
          )}
        />
      </PersistGate>
    </Provider>
  </StrictMode>
)

export default Root
