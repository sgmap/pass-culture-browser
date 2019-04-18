import { selectRecommendations } from './recommendations'
import { ROOT_PATH } from '../utils/config'

const fakeLastReco = {
  mediation: {
    firstThumbDominantColor: [205, 54, 70],
    frontText:
      'Vous avez parcouru toutes les offres. Revenez bientôt pour découvrir les nouveautés.',
    id: 'fin',
    thumbCount: 1,
    tutoIndex: -1,
  },
  mediationId: 'fin',
  thumbUrl: `${ROOT_PATH}/splash-finReco@2x.png`,
  uniqId: 'tuto_-1',
}

const selectRecommendationsForDiscovery = state =>
  selectRecommendations(state).concat([fakeLastReco])

export default selectRecommendationsForDiscovery
