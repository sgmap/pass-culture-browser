import { shallow } from 'enzyme'
import React from 'react'
import { Switch } from 'react-router-dom'

import Search from '../Search'
import Spinner from '../../../layout/Spinner'
import PageHeader from '../../../layout/Header/PageHeader'

const getPageContentRoute = wrapper =>
  wrapper
    .find({ path: '/recherche/(resultats)?/:option?/:subOption(menu)?' })
    .props()
    .render()

const getPageContentDiv = wrapper =>
  getPageContentRoute(wrapper).props.children.find(child =>
    child.props.className.includes('page-content')
  )

const getPageContentForm = wrapper =>
  getPageContentDiv(wrapper).props.children.find(child => child.type === 'form')

const getPageContentFilter = wrapper =>
  getPageContentForm(wrapper).props.children.find(child => child.key === 'SearchFilterContainer')

const getPageContentSwitch = wrapper =>
  getPageContentDiv(wrapper).props.children.find(child => child.type === Switch)

const getPageContentSpinner = wrapper =>
  getPageContentSwitch(wrapper).props.children.find(child => child.type === Spinner)

const getSwitchedPageContent = path => wrapper =>
  getPageContentSwitch(wrapper)
    .props.children.find(child => child.props.path === path)
    .props.render()

const getSearchResults = wrapper =>
  getSwitchedPageContent('/recherche/resultats/:menu(menu)?')(wrapper)

const getSearchSpinner = wrapper => getPageContentSpinner(wrapper)

const getSearchResultsFromCategory = wrapper =>
  getSwitchedPageContent('/recherche/resultats/:categorie([A-Z][a-z]+)/:menu(menu)?')(wrapper).props
    .children[1]

const getKeywordsInput = wrapper =>
  getPageContentForm(wrapper)
    .props.children[0].props.children.find(child => child.props.id === 'search-page-keywords-field')
    .props.children[0].props.children.find(child => child.props.id === 'keywords')

const getRefreshKeywordsButton = wrapper =>
  getPageContentForm(wrapper).props.children[0].props.children.find(
    child => child.props.id === 'search-page-keywords-field'
  ).props.children[0].props.children[2].props.children

const getFilterToggle = wrapper =>
  getPageContentForm(wrapper).props.children[0].props.children.find(
    child => child.props.id === 'search-filter-menu-toggle-button'
  ).props.children

describe('src | components | pages | Search', () => {
  // Initializing Mocks
  const dispatchMock = jest.fn()
  const queryChangeMock = jest.fn()
  const historyMock = { push: jest.fn() }

  const baseInitialProps = {
    dispatch: dispatchMock,
    history: historyMock,
    location: {
      hash: '',
      key: 'lxn6vp',
      pathname: '/recherche',
      search: '?orderBy=offer.id+desc',
      state: undefined,
    },
    match: {
      params: {
        option: undefined,
        subOption: undefined,
        view: undefined,
      },
    },
    query: {
      change: queryChangeMock,
      parse: () => ({ page: '1' }),
    },
    recommendations: [],
    search: {},
    typeSublabels: [],
    typeSublabelsAndDescription: [],
  }

  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<Search {...baseInitialProps} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('switch Route', () => {
    describe('on the /recherche page', () => {
      // given
      const wrapper = shallow(<Search {...baseInitialProps} />)

      it('should render the page title', () => {
        expect(wrapper.find(PageHeader).props().title).toBe('Recherche')
      })

      it('submitButton form is disabled', async () => {
        // when
        const button = getPageContentForm(wrapper).props.children[0].props.children.find(
          child => child.props.id === 'search-page-keywords-field'
        ).props.children[1].props.children
        // then
        expect(button.props.disabled).toBe(true)
      })

      it('filter should be invisible', () => {
        // when
        const searchFilterComponent = getPageContentFilter(wrapper)
        // then
        expect(searchFilterComponent.props.isVisible).toBe(false)
      })

      it('filter shoud be visible when state isFilterVisible is set to true ', () => {
        // when
        const wrapperInstance = wrapper.instance()
        wrapperInstance.setState({ isFilterVisible: true })
        const searchFilterComponent = getPageContentFilter(wrapper)

        // then
        expect(searchFilterComponent.props.isVisible).toBe(true)
      })

      it('navByOfferType with path="/recherche"', () => {
        // when
        const NavByOfferTypeComponent = getSwitchedPageContent('/recherche/:menu(menu)?')(wrapper)

        // then
        expect(NavByOfferTypeComponent.props.title).toBe('EXPLORER LES CATÉGORIES')
      })
    })

    describe('on /recherche/resultats page', () => {
      describe('on /recherche/resultats precisely', () => {
        // given
        const initialProps = Object.assign({}, baseInitialProps)
        initialProps.location = Object.assign({}, baseInitialProps.location, {
          pathname: '/recherche/resultats',
        })
        const wrapper = shallow(<Search {...initialProps} />)

        it('should render the page title', () => {
          expect(wrapper.find(PageHeader).props().title).toBe('Recherche : résultats')
        })

        it('searchResults with path="/recherche/resultats"', () => {
          // when
          const SearchResults = getSearchResults(wrapper)

          // then
          expect(SearchResults.props.cameFromOfferTypesPage).toBe(false)
        })
      })

      describe('on /recherche/resultats/:categorie page', () => {
        // given
        const initialProps = Object.assign({}, baseInitialProps)
        initialProps.location = Object.assign({}, baseInitialProps.location, {
          pathname: '/recherche/resultats/Jouer',
        })
        initialProps.match = Object.assign({}, baseInitialProps.params, {
          params: Object.assign({}, baseInitialProps.match.params, {
            option: 'Jouer',
          }),
        })
        initialProps.query = Object.assign({}, baseInitialProps.query, {
          parse: () => ({
            categories: 'Jouer',
            'mots-cles': 'Fake',
          }),
        })
        initialProps.typeSublabelsAndDescription = [
          {
            description:
              'Résoudre l’énigme d’un jeu de piste dans votre ville ? Jouer en ligne entre amis ? Découvrir cet univers étrange avec une manette ?',
            sublabel: 'Jouer',
          },
        ]
        const wrapper = shallow(<Search {...initialProps} />)

        describe('when search has finished loading', () => {
          it('should mount navResultsHeader & SearchResults with path="/recherche/resultats/:categorie"', () => {
            // given
            wrapper.setState({ isLoading: false })
            // when
            const ResultsRoute = getSwitchedPageContent(
              '/recherche/resultats/:categorie([A-Z][a-z]+)/:menu(menu)?'
            )(wrapper)
            const NavResultsHeader = ResultsRoute.props.children[0]
            const SearchResults = getSearchResultsFromCategory(wrapper)

            // then
            expect(NavResultsHeader.props.category).toBe('Jouer')
            expect(NavResultsHeader.props.description).toBe(
              'Résoudre l’énigme d’un jeu de piste dans votre ville ? Jouer en ligne entre amis ? Découvrir cet univers étrange avec une manette ?'
            )
            expect(SearchResults.props.keywords).toBe('Fake')
            expect(SearchResults.props.cameFromOfferTypesPage).toBe(true)
          })
        })

        describe('when search is loading', () => {
          it('should mount loading spinner', () => {
            // given
            wrapper.setState({ isLoading: true })
            // when
            const Spinner = getSearchSpinner(wrapper)
            // then
            expect(Spinner.key).toBe('loader')
            expect(Spinner.props.label).toBe('Recherche en cours')
          })
        })
      })
    })
  })

  describe('functions', () => {
    describe('constructor', () => {
      it('should initialize state correctly', () => {
        // given
        const initialProps = Object.assign({}, baseInitialProps)
        initialProps.query = Object.assign({}, baseInitialProps.query, {
          parse: () => ({ 'mots-cles': 'Fake' }),
        })

        // when
        const wrapper = shallow(<Search {...initialProps} />)
        const expected = {
          isLoading: false,
          hasMore: false,
          isFilterVisible: false,
          keywordsKey: 0,
          keywordsValue: 'Fake',
        }

        // then
        expect(wrapper.state()).toStrictEqual(expected)
      })
    })

    describe('handleDataRequest', () => {
      describe('on resultats page', () => {
        it('should dispatch requestDataTypes when component is rendered', () => {
          // when
          const wrapper = shallow(<Search {...baseInitialProps} />)
          wrapper.instance().componentDidMount()
          const expectedRequestedGetTypes = {
            config: {
              apiPath: '/types',
              method: 'GET',
            },
            type: 'REQUEST_DATA_GET_/TYPES',
          }

          // then
          expect(dispatchMock.mock.calls[1][0]).toStrictEqual(expectedRequestedGetTypes)
        })
      })
    })

    describe('back link', () => {
      describe('on results page', () => {
        describe('goBack()', () => {
          it('should back to /recherche', () => {
            // given
            const wrapper = shallow(<Search {...baseInitialProps} />)

            // when
            const url = wrapper.instance().goBack()

            // then
            expect(url).toBe('/recherche')
          })

          it('should back to /recherche/resultats/Applaudir', () => {
            // given
            baseInitialProps.match.params.subOption = 'item'
            baseInitialProps.location.pathname = '/recherche/resultats/Applaudir'
            const wrapper = shallow(<Search {...baseInitialProps} />)

            // when
            const url = wrapper.instance().goBack()

            // then
            expect(url).toBe('/recherche/resultats/Applaudir?orderBy=offer.id+desc')
          })
        })

        describe('reinitializeStates()', () => {
          it('should reinitialize states when click the back link', () => {
            // given
            const wrapper = shallow(<Search {...baseInitialProps} />)

            // when
            wrapper.instance().reinitializeStates()

            // then
            expect(wrapper.state()).toStrictEqual({
              isLoading: false,
              hasMore: false,
              isFilterVisible: false,
              keywordsKey: 1,
              keywordsValue: '',
            })
          })
        })
      })

      describe('not on results page', () => {
        it('should not display back button', () => {
          // when
          const wrapper = shallow(<Search {...baseInitialProps} />)

          // then
          expect(wrapper.contains('.back-link')).toBe(false)
        })
      })
    })

    describe('handleOnSubmit', () => {
      // when
      const wrapper = shallow(<Search {...baseInitialProps} />)
      const event = Object.assign(jest.fn(), {
        preventDefault: () => {},
        target: {
          elements: {
            keywords: {
              value: 'AnyWord',
            },
          },
        },
      })
      const wrapperInstance = wrapper.instance()
      wrapperInstance.setState({ isFilterVisible: true })

      describe('when keywords is not an empty string', () => {
        it('should update state with mots-clés set to value given', () => {
          // when
          wrapperInstance.handleOnSubmit(event)

          const expected = {
            isLoading: false,
            hasMore: false,
            isFilterVisible: false,
            keywordsKey: 0,
            keywordsValue: undefined,
          }

          // then
          expect(wrapper.state()).toStrictEqual(expected)
        })
        it('should change query', () => {
          // when
          wrapperInstance.handleOnSubmit(event)

          const argument1 = {
            'mots-cles': 'AnyWord',
            page: null,
          }
          const argument2 = {
            pathname: '/recherche/resultats',
          }

          // then
          expect(queryChangeMock).toHaveBeenCalledWith(argument1, argument2)
          queryChangeMock.mockClear()
        })
      })

      describe('when keywords is an empty string', () => {
        it('should change query with mots-clés setted to null', () => {
          // given
          const eventEmptyWord = Object.assign(jest.fn(), {
            preventDefault: () => {},
            target: {
              elements: {
                keywords: {
                  value: '',
                },
              },
            },
          })

          // when
          wrapperInstance.handleOnSubmit(eventEmptyWord)

          // then
          const argument1 = {
            'mots-cles': null,
            page: null,
          }
          const argument2 = {
            pathname: '/recherche/resultats',
          }

          // then
          expect(queryChangeMock).toHaveBeenCalledWith(argument1, argument2)
          queryChangeMock.mockClear()
        })
      })
    })

    describe('onKeywoFilterByDates.spec.jsrdsEraseClick', () => {
      describe('when no char has been typed', () => {
        it('button should not appear', () => {
          // when
          const wrapper = shallow(<Search {...baseInitialProps} />)
          const button = wrapper.find('form').find('#refresh-keywords-button')

          // then
          expect(button).not.toHaveProperty('onClick')
        })
      })

      describe('when one char has been typed', () => {
        const wrapper = shallow(<Search {...baseInitialProps} />)
        const wrapperInstance = wrapper.instance()
        wrapperInstance.setState({ keywordsValue: 'A' })

        it('should update state', () => {
          // when
          const button = getRefreshKeywordsButton(wrapper)
          button.props.onClick()

          const expected = {
            isLoading: false,
            hasMore: false,
            isFilterVisible: false,
            keywordsKey: 1,
            keywordsValue: '',
          }

          // then
          expect(wrapper.state()).toStrictEqual(expected)
        })

        it('should change navigation', () => {
          // when
          wrapperInstance.setState({ keywordsValue: 'A' })
          const button = getRefreshKeywordsButton(wrapper)
          button.props.onClick()

          // then
          expect(wrapperInstance.state.keywordsValue).toBe('')
          queryChangeMock.mockClear()
        })
      })
    })

    describe('onKeywordsChange', () => {
      // when
      const wrapper = shallow(<Search {...baseInitialProps} />)
      const event = {
        target: {
          value: 'Any',
        },
      }

      const wrapperInstance = wrapper.instance()
      wrapperInstance.setState({ isFilterVisible: true })

      it('should update state with keywords value', () => {
        // when
        getKeywordsInput(wrapper).props.onChange(event)

        // then
        const expected = {
          isLoading: false,
          hasMore: false,
          isFilterVisible: true,
          keywordsKey: 0,
          keywordsValue: 'Any',
        }

        // then
        expect(wrapper.state()).toStrictEqual(expected)
      })
    })

    describe('onClickOpenCloseFilterDiv', () => {
      describe('when user does not click on the icon button', () => {
        // when
        const wrapper = shallow(<Search {...baseInitialProps} />)

        const filterToggleIcon = getFilterToggle(wrapper).props.children

        it('should show ico-filter', () => {
          expect(filterToggleIcon.props.svg).toBe('ico-filter')
        })

        it('isFilterVisible state is false', () => {
          const expected = {
            isLoading: false,
            hasMore: false,
            isFilterVisible: false,
            keywordsKey: 0,
            keywordsValue: undefined,
          }

          // then
          expect(filterToggleIcon.props.svg).toBe('ico-filter')
          expect(wrapper.state()).toStrictEqual(expected)
        })
      })

      describe('when user click on the icon button', () => {
        // when
        const wrapper = shallow(<Search {...baseInitialProps} />)
        const filterToggle = getFilterToggle(wrapper)
        filterToggle.props.onClick(true)
        const filterToggleIcon = getFilterToggle(wrapper).props.children

        it('should update isFilterVisible state to true', () => {
          const expected = {
            isLoading: false,
            hasMore: false,
            isFilterVisible: true,
            keywordsKey: 0,
            keywordsValue: undefined,
          }

          // then
          expect(wrapper.state()).toStrictEqual(expected)
        })

        it('should show chevron-up icon', () => {
          expect(filterToggleIcon.props.svg).toBe('ico-chevron-up')
        })
      })

      describe('when there is some filters in search', () => {
        it('should show ico-filter-active icon', () => {
          // given
          const initialProps = Object.assign({}, baseInitialProps)
          initialProps.query.parse = () => ({
            categories: '%C3%89couter,Pratiquer',
            date: '2018-09-25T09:38:20.576Z',
            days: null,
            distance: null,
            jours: '0-1,1-5,5-100000',
            latitude: null,
            longitude: null,
            [`mots-cles`]: null,
            page: '2',
            types: null,
          })

          // when
          const wrapper = shallow(<Search {...initialProps} />)
          const filterToggleIcon = getFilterToggle(wrapper).props.children

          // then
          expect(filterToggleIcon.props.svg).toBe('ico-filter-active')
        })
      })
    })
  })
})
