import { assignData, requestData } from 'pass-culture-shared'
import PropTypes from 'prop-types'
import { stringify } from 'query-string'
import React, { PureComponent } from 'react'
import { Route, Switch } from 'react-router-dom'

import { Icon } from '../layout/Icon'
import renderPageFooter from './search/Footer'
import renderPageHeader from './search/Header'
import NavByOfferType from './search/NavByOfferType'
import NavResultsHeader from './search/NavResultsHeader'
import SearchFilter from './search/SearchFilter'
import SearchResults from './search/SearchResults'
import isInitialQueryWithoutFilters, {
  getDescriptionForSublabel,
  INITIAL_FILTER_PARAMS,
  translateBrowserUrlToApiUrl,
} from './search/utils'

import Main from '../layout/Main'

class SearchPageContent extends PureComponent {
  constructor(props) {
    super(props)
    const { pagination } = props

    this.state = {
      hasMore: false,
      isFilterVisible: false,
      keywordsKey: 0,
      keywordsValue: pagination.query['mots-cles'],
    }

    props.dispatch(assignData({ recommendations: [] }))
  }

  componentDidMount() {
    const { dispatch, pagination } = this.props

    dispatch(requestData('GET', 'types'))

    if (pagination.query.page) {
      pagination.change({ page: null })
    } else {
      this.handleRecommendationsRequest()
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { search },
    } = this.props
    if (search !== prevProps.location.search) {
      this.handleRecommendationsRequest()
    }
  }

  handleRecommendationsRequest = () => {
    const { dispatch, match, pagination } = this.props
    const { query } = pagination

    if (match.params.view !== 'resultats') {
      return
    }

    console.log('handleRecommendationsRequest query', query)

    const apiQuery = translateBrowserUrlToApiUrl(query)
    const apiQueryString = stringify(apiQuery)

    const path = `recommendations?${apiQueryString}`

    const path = `recommendations?page=${page}&${apiQueryString}`
    dispatch(
      requestData('GET', path, {
        handleSuccess: (state, action) => {
          if (action.data && action.data.length === 0) {
            this.setState({ hasMore: false })
          } else {
            this.setState({ hasMore: true })
          }
        },
      })
    )
  }

  onBackToSearchHome = () => {
    const { keywordsKey } = this.state
    const { pagination } = this.props

    this.setState({
      // https://stackoverflow.com/questions/37946229/how-do-i-reset-the-defaultvalue-for-a-react-input
      // WE NEED TO MAKE THE PARENT OF THE KEYWORD INPUT
      // DEPENDING ON THE KEYWORDS VALUE IN ORDER TO RERENDER
      // THE INPUT WITH A SYNCED DEFAULT VALUE
      isFilterVisible: false,
      keywordsKey: keywordsKey + 1,
      keywordsValue: '',
    })
    pagination.change(
      {
        categories: null,
        date: null,
        jours: null,
        'mots-cles': null,
        page: null,
      },
      {
        pathname: '/recherche',
      }
    )
  }

  onSubmit = event => {
    const { dispatch, pagination } = this.props
    const { value } = event.target.elements.keywords
    event.preventDefault()

    this.setState({ isFilterVisible: false })

    if (value !== '') {
      dispatch(assignData({ recommendations: [] }))
    }

    pagination.change(
      {
        'mots-cles': value === '' ? null : value,
        page: null,
      },
      { pathname: '/recherche/resultats' }
    )
  }

  onClickOpenCloseFilterDiv = isFilterVisible => () => {
    this.setState({ isFilterVisible: !isFilterVisible })
  }

  onKeywordsChange = event => {
    this.setState({
      keywordsValue: event.target.value,
    })
  }

  onKeywordsEraseClick = () => {
    const { dispatch, location, pagination } = this.props
    const { keywordsKey } = this.state

    this.setState({
      // https://stackoverflow.com/questions/37946229/how-do-i-reset-the-defaultvalue-for-a-react-input
      // WE NEED TO MAKE THE PARENT OF THE KEYWORD INPUT
      // DEPENDING ON THE KEYWORDS VALUE IN ORDER TO RERENDER
      // THE INPUT WITH A SYNCED DEFAULT VALUE
      keywordsKey: keywordsKey + 1,
      keywordsValue: '',
    })

    dispatch(assignData({ recommendations: [] }))

    pagination.change(
      { 'mots-cles': null, page: null },
      { pathname: location.pathname }
    )
  }

  render() {
    const {
      location,
      match,
      pagination,
      recommendations,
      typeSublabels,
      typeSublabelsAndDescription,
    } = this.props

    const { hasMore, keywordsKey, keywordsValue, isFilterVisible } = this.state
    const { query } = pagination
    const onResultPage = match.params.view === 'resultats'
    const keywords = query[`mots-cles`]

    const backButton = onResultPage && {
      onClick: () => this.onBackToSearchHome(),
    }

    const whithoutFilters = isInitialQueryWithoutFilters(
      INITIAL_FILTER_PARAMS,
      query
    )

    const iconName = whithoutFilters ? 'filter' : 'filter-active'

    const filtersToggleButtonClass =
      (isFilterVisible && 'filters-are-opened') || ''

    const isOneCharInKeywords = keywordsValue && keywordsValue.length > 0

    // ******************** Displaying datas helpers ********************** //
    const searchPageTitle = onResultPage ? 'Recherche : résultats' : 'Recherche'

    let description
    const category = decodeURIComponent(pagination.query.categories)
    if (location.pathname.indexOf('/resultats/') !== -1) {
      description = getDescriptionForSublabel(
        category,
        typeSublabelsAndDescription
      )
    }

    return (
      <Main
        id="search-page"
        backButton={backButton}
        handleDataRequest={() => {}}
        header={renderPageHeader}
        pageTitle={searchPageTitle}
        name="search"
        footer={renderPageFooter}
        closeSearchButton
      >
        <form onSubmit={this.onSubmit}>
          <div className="flex-columns items-start">
            <div
              id="search-page-keywords-field"
              className="field has-addons flex-columns flex-1"
            >
              <p className="control has-icons-right flex-1" key={keywordsKey}>
                <input
                  // FIXME autoFocus Github Issue #867
                  id="keywords"
                  defaultValue={keywordsValue}
                  className="input search-input"
                  placeholder="Un mot-clé"
                  type="text"
                  onChange={this.onKeywordsChange}
                />
                {isOneCharInKeywords && (
                  <span className="icon is-small is-right">
                    <button
                      type="button"
                      className="no-border no-background is-red-text"
                      id="refresh-keywords-button"
                      onClick={this.onKeywordsEraseClick}
                    >
                      <span
                        aria-hidden
                        className="icon-legacy-close"
                        title=""
                      />
                    </button>
                  </span>
                )}
              </p>

              <div className="control flex-0">
                <button
                  className="button is-rounded is-medium"
                  id="keywords-search-button"
                  type="submit"
                  disabled={!isOneCharInKeywords}
                >
                  Chercher
                </button>
              </div>
            </div>
            {/* ************************* BOUTON OPEN CLOSE FILTER ************************* */}
            <div
              id="search-filter-menu-toggle-button"
              className={`flex-0 text-center flex-rows flex-center pb12 ${filtersToggleButtonClass}`}
            >
              <button
                type="button"
                className="no-border no-background no-outline "
                onClick={this.onClickOpenCloseFilterDiv(isFilterVisible)}
              >
                <Icon
                  svg={`ico-${isFilterVisible ? 'chevron-up' : iconName}`}
                />
              </button>
            </div>
          </div>
        </form>

        <SearchFilter isVisible={isFilterVisible} pagination={pagination} />

        <Switch location={location}>
          <Route
            exact
            path="/recherche"
            render={() => (
              <NavByOfferType
                pagination={pagination}
                title="PAR CATÉGORIES"
                typeSublabels={typeSublabels}
              />
            )}
          />
          <Route
            path="/recherche/resultats/:categorie"
            render={() => [
              <NavResultsHeader
                category={category}
                description={description}
              />,
              <SearchResults
                hasMore={hasMore}
                items={recommendations}
                keywords={keywords}
                loadMoreHandler={this.loadMoreHandler}
                pagination={pagination}
                typeSublabels={typeSublabels}
                withNavigation
              />,
            ]}
          />
          <Route
            path="/recherche/resultats"
            render={() => (
              <SearchResults
                hasMore={hasMore}
                items={recommendations}
                keywords={keywords}
                pagination={pagination}
                typeSublabels={typeSublabels}
                withNavigation={false}
              />
            )}
          />
        </Switch>
      </Main>
    )
  }
}

SearchPageContent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  recommendations: PropTypes.array.isRequired,
  typeSublabels: PropTypes.array.isRequired,
  typeSublabelsAndDescription: PropTypes.array.isRequired,
}

export default SearchPageContent
