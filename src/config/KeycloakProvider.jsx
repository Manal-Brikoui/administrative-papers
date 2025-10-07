import React, { useState, useEffect } from 'react';
import keycloak from './keycloak';
import { KeycloakContext } from './keycloakContext';

export const KeycloakProvider = ({ children }) => {
  const [kcInitialized, setKcInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      enableLogging: true,
      pkceMethod: 'S256',
    }).then(auth => {
      setAuthenticated(auth);
      setKcInitialized(true);

      if (auth) {
        localStorage.setItem('access_token', keycloak.token);
        localStorage.setItem('refresh_token', keycloak.refreshToken);
      }

      // Rafraîchissement automatique du token toutes les 60 secondes
      const interval = setInterval(() => {
        keycloak.updateToken(70)
          .then(refreshed => {
            if (refreshed) {
              localStorage.setItem('access_token', keycloak.token);
              localStorage.setItem('refresh_token', keycloak.refreshToken);
              console.log('Token rafraîchi');
            }
          })
          .catch(() => console.warn('Erreur lors du rafraîchissement du token'));
      }, 60000);

      // Nettoyage de l'intervalle
      return () => clearInterval(interval);

    }).catch(err => console.error('Keycloak init failed', err));
  }, []);

  if (!kcInitialized) return <div>Loading...</div>;

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};
