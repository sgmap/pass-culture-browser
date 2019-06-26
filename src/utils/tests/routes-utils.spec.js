import { filterRoutes, getMenuRoutes } from '../routes-utils'

import routes from '../routes'

import DiscoveryContainer from '../../components/pages/discovery/DiscoveryContainer'
import FavoritesPage from '../../components/pages/FavoritesPage'
import MyBookingsPage from '../../components/pages/my-bookings'
import ProfilePage from '../../components/pages/profile'
import SearchContainer from '../../components/pages/search/SearchContainer'

describe('filterRoutes', () => {
  it('filters routes for react-router', () => {
    const values = [
      { path: '/' },
      { path: '/toto' },
      { path: '/toto/:vars?' },
      { exact: true, path: '/toto/:vars?/vars2?' },
      { exact: false, path: '/toto/:vars?/:vars2?/:vars3?' },
      { href: 'maitlo:mail.cool' },
    ]
    const result = filterRoutes(values)
    const expected = [
      { exact: true, path: '/' },
      { exact: true, path: '/toto' },
      { exact: true, path: '/toto/:vars?' },
      { exact: true, path: '/toto/:vars?/vars2?' },
      { exact: false, path: '/toto/:vars?/:vars2?/:vars3?' },
      null,
    ]
    expect(result).toStrictEqual(expected)
  })
  it('filters out routes with disabled true', () => {
    // Given
    const allRoutes = [
      { disabled: false, exact: true, path: '/' },
      { disabled: true, exact: true, path: '/disabledRoute' },
      { exact: true, path: '/unknownDisableRoute' },
    ]

    // When
    const filteredRoutes = filterRoutes(allRoutes)

    // Then
    expect(filteredRoutes).toStrictEqual([
      { disabled: false, exact: true, path: '/' },
      { exact: true, path: '/unknownDisableRoute' },
    ])
  })
})

describe('getMenuRoutes', () => {
  it('filter routes for react-router', () => {
    const values = [
      { path: '/' },
      { path: '/toto' },
      { icon: 'toto', path: '/toto/:vars?' },
      { href: '/toto/:vars?', icon: 'toto' },
      { exact: true, path: '/toto/:vars?/vars2?' },
      { icon: 'toto', path: '/toto/:vars?/:vars2?/:vars3?' },
      { href: 'mailto:mail.cool' },
      { href: 'mailto:mail.cool', icon: 'toto' },
    ]
    const result = getMenuRoutes(values)
    const expected = [
      { icon: 'toto', path: '/toto' },
      { href: '/toto/:vars?', icon: 'toto' },
      { icon: 'toto', path: '/toto' },
      { href: 'mailto:mail.cool', icon: 'toto' },
    ]
    expect(result).toStrictEqual(expected)
  })

  it('should filter routes from webapp', () => {
    // when
    const result = getMenuRoutes(routes)
    const expected = [
      {
        component: DiscoveryContainer,
        disabled: false,
        icon: 'offres-w',
        path: '/decouverte',
        title: 'Les offres',
      },
      {
        component: SearchContainer,
        disabled: false,
        icon: 'search-w',
        path: '/recherche',
        title: 'Recherche',
      },
      {
        component: MyBookingsPage,
        disabled: false,
        icon: 'calendar-w',
        path: '/reservations',
        title: 'Mes réservations',
      },
      {
        component: FavoritesPage,
        disabled: true,
        icon: 'like-w',
        path: '/favoris',
        title: 'Mes préférés',
      },
      {
        component: ProfilePage,
        disabled: false,
        icon: 'user-w',
        path: '/profil',
        title: 'Mon compte',
      },
      {
        disabled: false,
        href: 'https://docs.passculture.app/experimentateurs',
        icon: 'help-w',
        target: '_blank',
        title: 'Aide',
      },
      {
        disabled: false,
        href:
          'https://pass-culture.gitbook.io/documents/textes-normatifs/mentions-legales-et-conditions-generales-dutilisation-de-lapplication-pass-culture',
        icon: 'txt-w',
        target: '_blank',
        title: 'Mentions légales',
      },
    ]

    // then
    expect(result).toEqual(expected)
  })
})
