import { mapStateToProps } from '../DuoOfferContainer'

describe('src | components | layout | DuoOffer | DuoOfferContainer', () => {
  let ownProps
  let state

  beforeEach(() => {
    ownProps = {
      offerId: 'AAAA',
    }

    state = {
      data: {
        features: [
          {
            isActive: true,
            nameKey: 'DUO_OFFER',
          },
        ],
        offers: [
          {
            id: 'AAAA',
            isDuo: true,
            stockId: 'ABCD',
          },
        ],
        stocks: [
          {
            available: 2,
            id: 'ABCD',
            offerId: 'AAAA',
          },
        ],
      },
    }
  })

  describe('mapStateToProps', () => {
    it('should return an object with isDisabled to true when stock is more than 2 and feature enable and is on duo offer', () => {
      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        isDuoOffer: true,
      })
    })

    it('should return an object with isDisabled to false when stock is less than 2', () => {
      // given
      state.data.stocks = [
        {
          available: 1,
          id: 'ABCD',
          offerId: 'AAAA',
        },
      ]

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        isDuoOffer: false,
      })
    })

    it('should return an object with isDisabled to false when feature is not enable', () => {
      // given
      state.data.features = [
        {
          isActive: false,
          nameKey: 'DUO_OFFER',
        },
      ]

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        isDuoOffer: false,
      })
    })

    it('should return an object with isDisabled to false when offer is not Duo', () => {
      // given
      state.data.offers = [
        {
          id: 'AAAA',
          isDuo: false,
          stockId: 'ABCD',
        },
      ]

      // when
      const props = mapStateToProps(state, ownProps)

      // then
      expect(props).toStrictEqual({
        isDuoOffer: false,
      })
    })
  })
})