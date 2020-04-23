import algoliasearch from 'algoliasearch'

import {
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_INDEX_NAME,
  ALGOLIA_SEARCH_API_KEY,
} from '../../utils/config'
import { FACETS } from './facets'
import { FILTERS } from './filters'

const DEFAULT_RADIUS_IN_KILOMETERS = 100

export const fetchAlgolia = ({
                               aroundRadius = DEFAULT_RADIUS_IN_KILOMETERS,
                               geolocation = null,
                               keywords = '',
                               isSearchAroundMe = false,
                               offerCategories = [],
                               offerIsDuo = false,
                               offerIsFree = false,
                               offerTypes = {
                                 isDigital: false,
                                 isEvent: false,
                                 isThing: false,
                               },
                               page = 0,
                               priceRange = [],
                               sortBy = '',
                             } = {}) => {
  const searchParameters = {
    page: page,
    ...buildFacetFilters(offerCategories, offerTypes, offerIsDuo),
    ...buildNumericFilters(offerIsFree, priceRange),
    ...buildGeolocationParameter(aroundRadius, geolocation, isSearchAroundMe),
  }
  const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_SEARCH_API_KEY)
  const index = client.initIndex(ALGOLIA_INDEX_NAME + sortBy)

  return index.search(keywords, searchParameters)
}

const buildFacetFilters = (offerCategories, offerTypes, offerIsDuo) => {
  if (offerCategories.length === 0 && offerTypes == null && offerIsDuo === false) {
    return
  }

  const facetFilters = []

  if (offerCategories.length > 0) {
    const categoriesPredicate = buildOfferCategoriesPredicate(offerCategories)
    facetFilters.push(categoriesPredicate)
  }

  const offerTypesPredicate = buildOfferTypesPredicate(offerTypes)
  if (offerTypesPredicate) {
    facetFilters.push(...offerTypesPredicate)
  }

  const offerIsDuoPredicate = buildOfferIsDuoPredicate(offerIsDuo)
  if (offerIsDuoPredicate) {
    facetFilters.push(offerIsDuoPredicate)
  }

  const atLeastOneFacetFilter = facetFilters.length > 0
  return atLeastOneFacetFilter ? { facetFilters } : {}
}

const buildNumericFilters = (offerIsFree, priceRange) => {
  const priceRangePredicate = buildOfferPriceRangePredicate(offerIsFree, priceRange)
  if (priceRangePredicate) {
    return { numericFilters: [priceRangePredicate] }
  }
  return {}
}

const buildOfferCategoriesPredicate = offerCategories => {
  return offerCategories.map(category => `${FACETS.OFFER_CATEGORY}:${category}`)
}

const buildOfferIsDuoPredicate = offerIsDuo => {
  if (offerIsDuo) {
    return `${FACETS.OFFER_IS_DUO}:${offerIsDuo}`
  }
}

const buildOfferPriceRangePredicate = (offerIsFree, offerPriceRange) => {
  if (offerIsFree) return `${FACETS.OFFER_PRICE} = 0`
  if (offerPriceRange.length === 2) {
    return `${FACETS.OFFER_PRICE}: ${offerPriceRange.join(' TO ')}`
  }
}

const buildOfferTypesPredicate = offerTypes => {
  const { isDigital, isEvent, isThing } = offerTypes
  if (isDigital) {
    if (!isEvent && !isThing) {
      return [`${FACETS.OFFER_IS_DIGITAL}:${isDigital}`]
    }
    if (!isEvent && isThing) {
      return [`${FACETS.OFFER_IS_THING}:${isThing}`]
    }
    if (isEvent && !isThing) {
      return [[`${FACETS.OFFER_IS_DIGITAL}:${isDigital}`, `${FACETS.OFFER_IS_EVENT}:${isEvent}`]]
    }
  } else {
    if (!isEvent && isThing) {
      return [`${FACETS.OFFER_IS_DIGITAL}:${isDigital}`, `${FACETS.OFFER_IS_THING}:${isThing}`]
    }
    if (isEvent && !isThing) {
      return [`${FACETS.OFFER_IS_EVENT}:${isEvent}`]
    }
    if (isEvent && isThing) {
      return [`${FACETS.OFFER_IS_DIGITAL}:${isDigital}`]
    }
  }
}

const buildGeolocationParameter = (aroundRadius, geolocation, isSearchAroundMe) => {
  if (geolocation) {
    const { longitude, latitude } = geolocation
    if (latitude && longitude) {
      const aroundRadiusInMeters = aroundRadius * 1000
      return {
        aroundLatLng: `${latitude}, ${longitude}`,
        aroundRadius: isSearchAroundMe ?
          aroundRadiusInMeters > 0 ? aroundRadiusInMeters : FILTERS.UNLIMITED_RADIUS
          : FILTERS.UNLIMITED_RADIUS
      }
    }
  }
}
