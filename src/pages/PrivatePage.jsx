import { useKeycloak } from '@react-keycloak/web'

const PrivatePage = () => {
  const { keycloak } = useKeycloak()

  if (!keycloak.authenticated) {
    return <div>Veuillez vous connecter pour accéder à cette page</div>
  }

  return (
    <div>
      <h1>Contenu protégé</h1>
      <p>Bonjour {keycloak.tokenParsed?.name} !</p>
      <pre>{JSON.stringify(keycloak.tokenParsed, null, 2)}</pre>
    </div>
  )
}

export default PrivatePage