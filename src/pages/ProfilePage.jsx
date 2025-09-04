// pages/ProfilePage.js
import { useKeycloak } from '@react-keycloak/web';

const ProfilePage = () => {
  const { keycloak } = useKeycloak();

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const titleStyle = {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #3498db'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const infoItemStyle = {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  };

  const valueStyle = {
    color: '#2c3e50',
    fontSize: '1.1rem'
  };

  const buttonStyle = {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '1rem',
    marginBottom: '1rem'
  };

  if (!keycloak.authenticated) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Profil Utilisateur</h1>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const user = keycloak.tokenParsed;
  const roles = keycloak.realmAccess?.roles || [];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Profil Utilisateur</h1>
        
        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={labelStyle}>Nom d'utilisateur</div>
            <div style={valueStyle}>{user.preferred_username || 'Non spécifié'}</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={labelStyle}>Nom complet</div>
            <div style={valueStyle}>{user.name || 'Non spécifié'}</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={labelStyle}>Email</div>
            <div style={valueStyle}>{user.email || 'Non spécifié'}</div>
          </div>
          
          <div style={infoItemStyle}>
            <div style={labelStyle}>Email vérifié</div>
            <div style={valueStyle}>{user.email_verified ? 'Oui' : 'Non'}</div>
          </div>
        </div>
        
        <div style={infoItemStyle}>
          <div style={labelStyle}>Rôles</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {roles.map(role => (
              <span key={role} style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div style={cardStyle}>
        <h2 style={{...titleStyle, fontSize: '1.5rem'}}>Actions</h2>
        <div>
          <button style={buttonStyle}>
            Modifier le profil
          </button>
          <button style={{...buttonStyle, backgroundColor: '#27ae60'}}>
            Changer le mot de passe
          </button>
          <button style={{...buttonStyle, backgroundColor: '#e74c3c'}} onClick={() => keycloak.logout()}>
            Se déconnecter
          </button>
        </div>
      </div>
      
      <div style={cardStyle}>
        <h2 style={{...titleStyle, fontSize: '1.5rem'}}>Informations de session</h2>
        <div style={infoItemStyle}>
          <div style={labelStyle}>Token d'accès</div>
          <div style={{
            ...valueStyle,
            wordBreak: 'break-all',
            fontSize: '0.8rem',
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '100px',
            overflowY: 'auto'
          }}>
            {keycloak.token}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;