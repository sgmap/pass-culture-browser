import React from 'react'
import FormFooter from '../../forms/FormFooter'

const BetaPage = () => (
  <div className="beta-page">
    <main className="bp-main">
      <div className="bp-title">
        {'Bienvenue dans\n'}
        {'votre pass Culture'}
      </div>
      <div className="bp-content">
        {'Vous avez 18 ans et vivez dans un\n'}
        <a
          href='https://pass.culture.fr/#jeune'
          rel="noopener noreferrer"
          target="_blank"
        >
          {'département éligible ?'}
        </a>
      </div>
      <div className="bp-content">
        {'Bénéficiez de 500 € afin de\n'}
        {'renforcer vos pratiques\n'}
        {"culturelles et d'en découvrir\n"}
        {'de nouvelles !'}
      </div>
    </main>
    <FormFooter
      externalLink={{
        id: 'sign-up-link',
        label: 'Créer un compte',
        target: '_blank',
        url: 'https://www.demarches-simplifiees.fr/commencer/inscription-pass-culture',
      }}
      submit={{
        id: 'sign-in-link',
        label: "J'ai un compte",
        url: '/connexion'
      }}
    />
  </div>
)

export default BetaPage
