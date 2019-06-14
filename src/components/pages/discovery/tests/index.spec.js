import React from 'react'
import { shallow } from 'enzyme'

import { RawDiscoveryPage } from '../index'

describe('src | components | pages | discovery | RawDiscoveryPage', () => {
  let props

  beforeEach(() => {
    props = {
      backButton: true,
      dispatch: jest.fn(),
      fromPassword: true,
      history: {},
      location: {
        search: '',
      },
      match: {
        params: {},
      },
    }
  })

  it('should match the snapshot', () => {
    // given
    const wrapper = shallow(<RawDiscoveryPage {...props} />)

    // then
    expect(wrapper).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  describe('constructor', () => {
    it('should initialize state correctly', () => {
      // given
      const wrapper = shallow(<RawDiscoveryPage {...props} />)

      // then
      const expected = {
        atWorldsEnd: false,
        hasError: false,
        isEmpty: null,
        isLoading: true,
      }
      expect(wrapper.state()).toEqual(expected)
    })
  })

  describe('handleDataRequest', () => {
    describe('One case', () => {
      it('should update recommendation infos using API when Main component is rendered', () => {
        // given
        shallow(<RawDiscoveryPage {...props} />)

        // then
        const expectedRequestDataAction = {
          config: {
            apiPath: '/recommendations?',
            body: {
              readRecommendations: null,
              seenRecommendationIds: null,
            },
            handleFail: expect.any(Function),
            handleSuccess: expect.any(Function),
            method: 'PUT',
            normalizer: {
              bookings: 'bookings',
            },
          },
          type: 'REQUEST_DATA_PUT_/RECOMMENDATIONS?',
        }
        expect(props.dispatch.mock.calls.length).toBe(1)
        expect(props.dispatch.mock.calls[0][0]).toEqual(
          expectedRequestDataAction
        )
      })
    })
  })
})
