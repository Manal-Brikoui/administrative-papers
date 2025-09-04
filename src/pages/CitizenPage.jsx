import { useKeycloak } from '@react-keycloak/web';

const CitizenPage = () => {
  const { keycloak } = useKeycloak();

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const headerStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const titleStyle = {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '1rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const cardTitleStyle = {
    color: '#2c3e50',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #3498db'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0
  };

  const listItemStyle = {
    padding: '0.8rem',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const badgeStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.9rem'
  };

  if (!keycloak.authenticated) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Espace Citoyen</h1>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Données factices pour la démonstration
  const userDocuments = [
    { id: 1, name: 'Carte d\'identité', date: '2023-05-15', status: 'Valide' },
    { id: 2, name: 'Permis de conduire', date: '2023-08-22', status: 'En cours de traitement' },
    { id: 3, name: 'Passeport', date: '2024-01-10', status: 'Expiré' }
  ];

  const requests = [
    { id: 1, type: 'Demande de certificat', date: '2023-11-05', status: 'Approuvée' },
    { id: 2, type: 'Renouvellement de document', date: '2023-12-18', status: 'En attente' }
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Espace Citoyen</h1>
        <p>Gérez vos documents administratifs et vos demandes.</p>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Mes Documents</h2>
        <ul style={listStyle}>
          {userDocuments.map(doc => (
            <li key={doc.id} style={listItemStyle}>
              <div>
                <strong>{doc.name}</strong> - Date: {doc.date}
              </div>
              <span style={{
                ...badgeStyle,
                backgroundColor: doc.status === 'Valide' ? '#27ae60' : 
                                doc.status === 'En cours de traitement' ? '#f39c12' : '#e74c3c'
              }}>
                {doc.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Mes Demandes</h2>
        <ul style={listStyle}>
          {requests.map(req => (
            <li key={req.id} style={listItemStyle}>
              <div>
                <strong>{req.type}</strong> - Date: {req.date}
              </div>
              <span style={{
                ...badgeStyle,
                backgroundColor: req.status === 'Approuvée' ? '#27ae60' : '#f39c12'
              }}>
                {req.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Nouvelle Demande</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Demander un certificat
          </button>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Renouveler un document
          </button>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Faire une réclamation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenPage;