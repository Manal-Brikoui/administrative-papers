import { useKeycloak } from '@react-keycloak/web';

const AdminPage = () => {
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

  // Vérifier si l'utilisateur a le rôle admin
  const hasAdminRole = keycloak.hasRealmRole('admin');

  if (!keycloak.authenticated) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Espace Administrateur</h1>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (!hasAdminRole) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Accès Refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  // Données factices pour la démonstration
  const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'Citoyen' },
    { id: 2, name: 'Marie Martin', email: 'marie.martin@example.com', role: 'Citoyen' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Administrateur' }
  ];

  const documents = [
    { id: 1, name: 'Document 1', owner: 'Jean Dupont', status: 'Approuvé' },
    { id: 2, name: 'Document 2', owner: 'Marie Martin', status: 'En attente' },
    { id: 3, name: 'Document 3', owner: 'Admin User', status: 'Rejeté' }
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Espace Administrateur</h1>
        <p>Gérez les utilisateurs et les documents du système.</p>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Utilisateurs</h2>
        <ul style={listStyle}>
          {users.map(user => (
            <li key={user.id} style={listItemStyle}>
              <div>
                <strong>{user.name}</strong> - {user.email}
              </div>
              <span style={badgeStyle}>{user.role}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Documents</h2>
        <ul style={listStyle}>
          {documents.map(doc => (
            <li key={doc.id} style={listItemStyle}>
              <div>
                <strong>{doc.name}</strong> - Propriétaire: {doc.owner}
              </div>
              <span style={{
                ...badgeStyle,
                backgroundColor: doc.status === 'Approuvé' ? '#27ae60' : 
                                doc.status === 'En attente' ? '#f39c12' : '#e74c3c'
              }}>
                {doc.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Actions Administratives</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Exporter les données
          </button>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Générer un rapport
          </button>
          <button style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Archiver les anciens documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;