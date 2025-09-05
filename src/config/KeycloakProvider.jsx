import React, { createContext, useState, useEffect } from 'react';
import keycloak from './keycloak';

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {
  const [kcInitialized, setKcInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      enableLogging: true,
      pkceMethod: 'S256'
    }).then(auth => {
      setAuthenticated(auth);
      setKcInitialized(true);

      if (auth) {
        localStorage.setItem('access_token', keycloak.token);
        localStorage.setItem('refresh_token', keycloak.refreshToken);
      }

      // Rafraîchissement automatique du token
      setInterval(() => {
        keycloak.updateToken(70)
          .then(refreshed => {
            if (refreshed) {
              localStorage.setItem('access-token', keycloak.token);
              localStorage.setItem('refresh-token', keycloak.refreshToken);
            }
          })
          .catch(() => console.warn('Erreur lors du rafraîchissement du token'));
      }, 60000);
    }).catch(err => console.error('Keycloak init failed', err));
  }, []);

  if (!kcInitialized) return <div>Loading...</div>;

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};
