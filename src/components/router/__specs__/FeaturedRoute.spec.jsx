import { shallow } from 'enzyme'
import React from 'react'
import { Route } from 'react-router-dom'

import FeaturedRoute from '../FeaturedRoute'
import NotMatch from '../../pages/NotMatch'

const Foo = () => <div />

describe('src | components | router | FeaturedRoute', () => {
  it('should match the snapshot', () => {
    // given
    const props = {
      areFeaturesLoaded: true,
      component: Foo,
      requestGetFeatures: jest.fn()
    }

    // when
    const wrapper = shallow(<FeaturedRoute {...props} />)

    // then
    expect(wrapper).toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })


  describe('when features are not yet loaded', () => {
    it('should render null when features', () => {
      // given
      const props = {
        areFeaturesLoaded: false,
        component: Foo,
        requestGetFeatures: jest.fn()
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(0)
    })

    it('should call requestGetFeatures when features', () => {
      // given
      const props = {
        areFeaturesLoaded: false,
        component: Foo,
        requestGetFeatures: jest.fn()
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(1)
    })
  })

  describe('when features are loaded and isFeatureDisabled', () => {
    it('should render NotMatch when features are loaded and isFeatureDisabled', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isFeatureDisabled: true,
        requestGetFeatures: jest.fn()
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(1)
      expect(routeWrapper.props().component).toBe(NotMatch)
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })

    it('should not call requestGetFeatures when features are loaded', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isFeatureDisabled: true,
        requestGetFeatures: jest.fn()
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })
  })

  describe('when features are loaded and not isFeatureDisabled', () => {
    it('should render Foo', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isFeatureDisabled: false,
        requestGetFeatures: jest.fn()
      }

      // when
      const wrapper = shallow(<FeaturedRoute {...props} />)

      // then
      const routeWrapper = wrapper.find(Route)
      expect(routeWrapper).toHaveLength(1)
      expect(routeWrapper.props().component).toBe(Foo)
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })

    it('should not call props.requestGetFeatures', () => {
      // given
      const props = {
        areFeaturesLoaded: true,
        component: Foo,
        isFeatureDisabled: false,
        requestGetFeatures: jest.fn()
      }

      // when
      shallow(<FeaturedRoute {...props} />)

      // then
      expect(props.requestGetFeatures).toHaveBeenCalledTimes(0)
    })
  })
})
