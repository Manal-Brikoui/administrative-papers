import Keycloak from 'keycloak-js'

const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'administrative-papers',
  clientId: 'admin-papers-web'
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak