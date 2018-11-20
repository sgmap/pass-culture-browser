import React from 'react'
import { shallow } from 'enzyme'
// import { Icon } from 'pass-culture-shared'

import SearchPageContent from '../SearchPageContent'

describe('src | components | pages | SearchPageContentContent', () => {
  // Initializing Mocks
  const dispatchMock = jest.fn()
  const paginationChangeMock = jest.fn()
  const goToNextPageMock = jest.fn()
  const historyMock = { push: jest.fn() }

  const initialProps = {
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
        categorie: undefined,
        view: undefined,
      },
    },
    pagination: {
      apiQueryString: 'orderBy=offer.id+desc',
      change: paginationChangeMock,
      goToNextPage: goToNextPageMock,
      page: 1,
      windowQuery: {
        categories: null,
        date: null,
        distance: null,
        jours: null,
        latitude: null,
        longitude: null,
        'mots-cles': null,
        orderBy: 'offer.id+desc',
      },
    },
    recommendations: [],
    search: {},
    typeSublabels: [],
    typeSublabelsAndDescription: [],
  }

  describe('snapshot', () => {
    it('should match snapshot', () => {
      // when
      const wrapper = shallow(<SearchPageContent {...initialProps} />)

      // then
      expect(wrapper).toBeDefined()
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('functions', () => {
    describe('constructor', () => {
      it('should initialize state correctly', () => {
        // given
        initialProps.pagination.windowQuery['mots-cles'] = 'Fake'
        // when
        const wrapper = shallow(<SearchPageContent {...initialProps} />)
        const expected = {
          keywordsKey: 0,
          keywordsValue: 'Fake',
          withFilter: false,
        }

        // then
        expect(wrapper.state()).toEqual(expected)
      })
    })

    describe('handleDataRequest', () => {
      describe('When arriving for the first time on search page with page = 1', () => {
        // when
        const wrapper = shallow(<SearchPageContent {...initialProps} />)
        wrapper.instance().handleDataRequest()

        it('should first dispatch requestDataTypes when component is rendered', () => {
          const expectedRequestedGetTypes = {
            config: {},
            method: 'GET',
            path: 'types',
            type: 'REQUEST_DATA_GET_TYPES',
          }

          // THEN
          expect(dispatchMock.mock.calls.length).toBe(2)
          expect(dispatchMock.mock.calls[0][0]).toEqual(
            expectedRequestedGetTypes
          )
        })

        it('should in a second time, dispatch requestData for recommendations based on apiQueryString when component is rendered', () => {
          const expectedRequestData = {
            config: {
              handleFail: () => {},
              handleSuccess: () => {},
            },
            method: 'GET',
            path: 'recommendations?page=1&orderBy=offer.id+desc',
            type: 'REQUEST_DATA_GET_RECOMMENDATIONS?PAGE=UNDEFINED&UNDEFINED',
          }

          // then
          expect(dispatchMock.mock.calls.length).toBe(2)
          expect(dispatchMock.mock.calls[1][0].path).toEqual(
            expectedRequestData.path
          )
        })
      })

      describe.skip('when ??? page !== 1 && search.page && page === Number(search.page) ', () => {
        // TODO

        it('should ???', () => {
          // given
          dispatchMock.mockClear()
          initialProps.pagination.page = 2

          // when
          const wrapper = shallow(<SearchPageContent {...initialProps} />)
          wrapper.instance().handleDataRequest()

          // expect
          expect(dispatchMock.mock.calls.length).toBe(2)
        })
      })

      describe.skip('goToNextPage', () => {})
    })

    describe('loadMoreHandler', () => {
      // given
      xit('should call handleDataRequest to request more offers', () => {
        // const handleDataRequestInstanceFc = wrapper.instance().handleDataRequest()
        // jest.mock(handleDataRequestInstanceFc)
        // const spy = jest.spyOn(wrapper.instance(), 'handleDataRequest')
        // when
      })
      it('should change history location', () => {
        // given
        initialProps.pagination.windowQueryString =
          'categories=Jouer&orderBy=offer.id+desc'

        // when
        const wrapper = shallow(<SearchPageContent {...initialProps} />)
        wrapper.instance().loadMoreHandler()
        const expected =
          '/recherche?page=1&categories=Jouer&orderBy=offer.id+desc'

        // then
        expect(historyMock.push).toHaveBeenCalledWith(expected)
      })
    })

    describe('onBackToSearchHome', () => {
      describe('On results page', () => {
        // Given
        initialProps.match.params.view = 'resultats'

        it('should update state', () => {
          // when
          const wrapper = shallow(<SearchPageContent {...initialProps} />)
          wrapper.props().backButton.onClick()

          const expected = {
            keywordsKey: 1,
            keywordsValue: '',
            withFilter: false,
          }

          // then
          expect(wrapper.state()).toEqual(expected)
        })
        it('should change pagination', () => {
          // when
          const wrapper = shallow(<SearchPageContent {...initialProps} />)
          wrapper.props().backButton.onClick()

          const argument1 = {
            categories: null,
            date: null,
            jours: null,
            'mots-cles': null,
          }
          const argument2 = { pathname: '/recherche' }

          // then
          expect(paginationChangeMock).toHaveBeenCalledWith(
            argument1,
            argument2
          )
          paginationChangeMock.mockClear()
        })
      })
      describe('Not on results page', () => {
        it('should not display back button', () => {
          // given
          initialProps.match.params.view = ''

          // when
          const wrapper = shallow(<SearchPageContent {...initialProps} />)

          // then
          expect(wrapper.props().backButton).toEqual(false)
        })
      })
    })

    describe('onSubmit', () => {
      // when
      const wrapper = shallow(<SearchPageContent {...initialProps} />)
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
      wrapperInstance.setState({ withFilter: true })
      describe('when keywords is an empty string', () => {
        it('should update state with mots-clés setted to value given', () => {
          // when
          wrapper.find('form').simulate('submit', event)

          const expected = {
            keywordsKey: 0,
            keywordsValue: null,
            withFilter: false,
          }

          // then
          expect(wrapper.state()).toEqual(expected)
        })
        it('should change pagination', () => {
          // when
          wrapper.find('form').simulate('submit', event)

          const argument1 = {
            'mots-cles': 'AnyWord',
          }
          const argument2 = {
            isClearingData: true,
            pathname: '/recherche/resultats',
          }

          // then
          expect(paginationChangeMock).toHaveBeenCalledWith(
            argument1,
            argument2
          )
          paginationChangeMock.mockClear()
        })
      })

      describe('when keywords is an empty string', () => {
        it('should change pagination with mots-clés setted to null', () => {
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
          wrapper.find('form').simulate('submit', eventEmptyWord)

          // then
          const argument1 = {
            'mots-cles': null,
          }
          const argument2 = {
            isClearingData: false,
            pathname: '/recherche/resultats',
          }

          // then
          expect(paginationChangeMock).toHaveBeenCalledWith(
            argument1,
            argument2
          )
          paginationChangeMock.mockClear()
        })
      })
    })

    describe('onKeywordsEraseClick', () => {
      describe('when no char has been typed', () => {
        it('button should not appear', () => {
          // when
          const wrapper = shallow(<SearchPageContent {...initialProps} />)
          const button = wrapper.find('form').find('#refresh-keywords-button')

          // then
          expect(button).not.toHaveProperty('onClick')
        })
      })

      describe('when one char has been typed', () => {
        const wrapper = shallow(<SearchPageContent {...initialProps} />)
        const wrapperInstance = wrapper.instance()
        wrapperInstance.setState({ keywordsValue: 'A' })

        it('should update state', () => {
          // when
          const button = wrapper.find('form').find('#refresh-keywords-button')
          button.props().onClick()

          const expected = {
            keywordsKey: 1,
            keywordsValue: '',
            withFilter: false,
          }
          // then
          expect(wrapper.state()).toEqual(expected)
        })
        it('should change navigation', () => {
          wrapperInstance.setState({ keywordsValue: 'A' })
          const button = wrapper.find('form').find('#refresh-keywords-button')
          button.props().onClick()

          // then
          expect(paginationChangeMock).toHaveBeenCalled()
          paginationChangeMock.mockClear()
        })
      })
    })

    // Bouton recherchre avec props disabled si !isOneCharInKeywords
    // Close button // wrapper.props().closeSearchButton
    // console.log('|||||| Wrapper Props', wrapper.props().backButton);
    // pageTitle={searchPageTitle}

    // describe('render', () => {
    //   describe('SearchFilter', () => {
    //     it('should be visible', () => {
    //
    //     })
    //   })
    // })
  })

  // Titre de la page selon s'il y a des recommendations ou pas.
})
