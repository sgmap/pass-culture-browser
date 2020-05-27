import { shallow } from 'enzyme'
import React from 'react'
import { Route } from 'react-router'

import Discovery from '../Discovery'
import LoaderContainer from '../../../layout/Loader/LoaderContainer'

describe('src | components | pages | discovery | Discovery', () => {
  let props

  beforeEach(() => {
    props = {
      coordinates: {
        longitude: 48.256756,
        latitude: 2.8796567,
        watchId: 1,
      },
      currentRecommendation: {},
      history: { push: jest.fn() },
      loadRecommendations: jest.fn(),
      location: {
        pathname: '',
        search: '',
      },
      match: {
        params: {},
      },
      readRecommendations: [],
      recommendations: [],
      redirectToFirstRecommendationIfNeeded: jest.fn(),
      resetReadRecommendations: jest.fn(),
      resetRecommendations: jest.fn(),
      resetRecommendationsAndBookings: jest.fn(),
      saveLastRecommendationsRequestTimestamp: jest.fn(),
      seedLastRequestTimestamp: 1574236357670,
      shouldReloadRecommendations: false,
      updateLastRequestTimestamp: jest.fn(),
    }
  })

  describe('constructor', () => {
    it('should initialize state with default values', () => {
      // given
      const wrapper = shallow(<Discovery {...props} />)

      // then
      expect(wrapper.state()).toStrictEqual({
        atWorldsEnd: false,
        hasError: false,
        hasError500: false,
        hasNoMoreRecommendations: false,
        isLoading: false,
      })
    })
  })

  describe('when mount', () => {
    it('should load recommendations when it is required to fetch recommendations', () => {
      // given
      props.shouldReloadRecommendations = true

      // when
      shallow(<Discovery {...props} />)

      // then
      expect(props.loadRecommendations).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        props.currentRecommendation,
        props.recommendations,
        props.readRecommendations,
        props.shouldReloadRecommendations,
        props.coordinates
      )
      expect(props.saveLastRecommendationsRequestTimestamp).toHaveBeenCalledWith()
    })

    it('should redirect to first recommendation when it is not required to fetch recommendations', () => {
      // given
      props.shouldReloadRecommendations = false

      // when
      shallow(<Discovery {...props} />)

      // then
      expect(props.loadRecommendations).not.toHaveBeenCalledWith()
      expect(props.saveLastRecommendationsRequestTimestamp).not.toHaveBeenCalledWith()
      expect(props.redirectToFirstRecommendationIfNeeded).toHaveBeenCalledWith(
        props.recommendations
      )
    })
  })

  describe('when unmount', () => {
    it('should display discovery when API is up and data are filled', () => {
      // given
      const wrapper = shallow(<Discovery {...props} />)

      // when
      wrapper.setState({
        hasError: false,
        hasNoMoreRecommendations: false,
        isLoading: false,
      })

      // then
      expect(wrapper.find(Route)).toHaveLength(2)
      expect(wrapper.find(LoaderContainer)).toHaveLength(1)
    })

    it('should display error message when API is down', () => {
      // given
      const wrapper = shallow(<Discovery {...props} />)

      // when
      wrapper.setState({
        hasError: true,
        hasNoMoreRecommendations: true,
        isLoading: false,
      })

      // then
      expect(wrapper.find(Route)).toHaveLength(0)
      expect(wrapper.find(LoaderContainer)).toHaveLength(1)
    })

    it('should display loading message when API is slow', () => {
      // given
      const wrapper = shallow(<Discovery {...props} />)

      // when
      wrapper.setState({
        hasError: false,
        hasNoMoreRecommendations: true,
        isLoading: true,
      })

      // then
      expect(wrapper.find(Route)).toHaveLength(0)
      expect(wrapper.find(LoaderContainer)).toHaveLength(1)
    })

    it('should display no offer message when API returns zero offer', () => {
      // given
      const wrapper = shallow(<Discovery {...props} />)

      // when
      wrapper.setState({
        hasError: false,
        hasNoMoreRecommendations: true,
        isLoading: false,
      })

      // then
      expect(wrapper.find(Route)).toHaveLength(0)
      expect(wrapper.find(LoaderContainer)).toHaveLength(1)
    })
  })

  describe('functions', () => {
    describe('handleSuccess', () => {
      it('should reset read recommendations', () => {
        // given
        const action = {
          payload: {
            data: [{ id: 'ABC1' }],
          },
        }
        const wrapper = shallow(<Discovery {...props} />)

        // when
        wrapper.instance().handleSuccess({}, action)

        // then
        expect(props.resetReadRecommendations).toHaveBeenCalledWith()
      })

      it('should set atWorldsEnd state to true when no recommendations have been fetched', () => {
        // given
        const action = {
          payload: {
            data: [],
          },
        }
        props.recommendations = [{ id: 'ABC1' }]
        const wrapper = shallow(<Discovery {...props} />)

        // when
        wrapper.instance().handleSuccess({}, action)

        // then
        expect(wrapper.state()).toStrictEqual({
          atWorldsEnd: true,
          hasError: false,
          hasError500: false,
          hasNoMoreRecommendations: false,
          isLoading: false,
        })
      })

      it('should set atWorldsEnd state to false when recommendations have been fetched', () => {
        // given
        const action = {
          payload: {
            data: [{ id: 'DEF2' }],
          },
        }
        props.recommendations = [{ id: 'ABC1' }]
        const wrapper = shallow(<Discovery {...props} />)

        // when
        wrapper.instance().handleSuccess({}, action)

        // then
        expect(wrapper.state()).toStrictEqual({
          atWorldsEnd: false,
          hasError: false,
          hasError500: false,
          hasNoMoreRecommendations: false,
          isLoading: false,
        })
      })

      it('should set hasNoMoreRecommendations state to true when no recommendations have been fetched and no recommendations are loaded', () => {
        // given
        const action = {
          payload: {
            data: [],
          },
        }
        props.recommendations = []
        const wrapper = shallow(<Discovery {...props} />)

        // when
        wrapper.instance().handleSuccess({}, action)

        // then
        expect(wrapper.state()).toStrictEqual({
          atWorldsEnd: true,
          hasError: false,
          hasError500: false,
          hasNoMoreRecommendations: true,
          isLoading: false,
        })
      })
    })
  })

  describe('when update', () => {
    it('should update seed last request timestamp when date is posterior to limit', () => {
      // given
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date('2019-11-20T13:00:00.000Z').valueOf())

      // when
      const wrapper = shallow(<Discovery {...props} />)
      props.location = {
        pathname: 'nouveauPath',
        search: '',
      }
      wrapper.setProps(props)

      // then
      expect(props.updateLastRequestTimestamp).toHaveBeenCalledWith()
    })

    it('should not update seed last request timestamp when date is anterior to limit', () => {
      // given
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date('2019-11-20T00:00:00.000Z').valueOf())

      // when
      const wrapper = shallow(<Discovery {...props} />)
      props.location = {
        pathname: 'nouveauPath',
        search: '',
      }
      wrapper.setProps(props)

      // then
      expect(props.updateLastRequestTimestamp).not.toHaveBeenCalledWith()
    })

    describe('when user refresh discovery', () => {
      it('should redirect to first recommendation when offerID is not in recommendations', () => {
        // given
        props.recommendations = [
          {
            offerId: 'A1',
          },
        ]
        props.match.params = {
          offerId: 'A1',
        }
        const wrapper = shallow(<Discovery {...props} />)
        props.recommendations = [
          {
            offerId: 'A2',
          },
        ]

        // when
        wrapper.setProps(props)

        // then
        expect(props.history.push).toHaveBeenCalledWith('/decouverte-v3')
      })

      it('should not redirect to first recommendation when offerId is in recommendations', () => {
        // given
        props.recommendations = [
          {
            offerId: 'A1',
          },
        ]
        props.match.params = {
          offerId: 'A1',
        }
        const wrapper = shallow(<Discovery {...props} />)

        // when
        wrapper.setProps(props)

        // then
        expect(props.history.push).not.toHaveBeenCalled()
      })

      it('should not redirect to first recommendation when reaching end of discovery', () => {
        // given
        props.recommendations = [
          {
            offerId: 'A1',
          },
        ]
        props.match.params = {
          offerId: 'A1',
        }
        const wrapper = shallow(<Discovery {...props} />)
        props.recommendations = []

        // when
        wrapper.setProps(props)

        // then
        expect(props.history.push).not.toHaveBeenCalled()
      })

      it('should not redirect to first recommendation when swiping to next recommendation', () => {
        // given
        props.currentRecommendation = {
          offerId: 'A1',
        }
        props.recommendations = [
          {
            offerId: 'A1',
          },
          {
            offerId: 'A2',
          },
        ]
        props.match.params = {
          offerId: 'A1',
        }
        const wrapper = shallow(<Discovery {...props} />)
        props.currentRecommendation = {
          offerId: 'A2',
        }

        // when
        wrapper.setProps(props)

        // then
        expect(props.history.push).not.toHaveBeenCalled()
      })
    })
  })
})
