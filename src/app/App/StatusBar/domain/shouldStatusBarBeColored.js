export const shouldStatusBarBeColored = pathname => {
  const pathWithColoredHeader = [
    '/accueil',
    '/accueil/profil/informations',
    '/accueil/profil/mot-de-passe',
    '/accueil/profil/mentions-legales',
    '/recherche/criteres-categorie',
    '/recherche/criteres-localisation',
    '/recherche/criteres-localisation/place',
    '/recherche/criteres-tri',
    '/recherche/resultats/tri',
    '/recherche/resultats/details/(.+)',
    '/recherche/resultats/filtres',
    '/recherche/resultats/filtres/localisation',
    '/recherche/resultats/filtres/localisation/place',
    '/reservations/details/(.+)',
    '/reservations/details/(.+)/qrcode',
    '/reservations/details/(.+)/reservation/annulation/confirmation',
    '/favoris/details/(.+)/(.+)',
    '/favoris/details/(.+)/(.+)/reservation',
    '/favoris/details/(.+)/(.+)/reservation/(.+)/annulation/confirmation',
  ]

  return RegExp(`(${pathWithColoredHeader.join('|')})$`).test(pathname)
}
