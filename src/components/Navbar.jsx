// components/Navbar.js
import { useKeycloak } from '@react-keycloak/web';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();

  const navStyle = {
    backgroundColor: '#2c3e50',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const brandStyle = {
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#3498db'
  };

  const buttonStyle = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s'
  };

  const registerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#27ae60'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'white'
  };

  if (!initialized) {
    return (
      <nav style={navStyle}>
        <div style={brandStyle}>Administrative Papers</div>
      </nav>
    );
  }

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>Administrative Papers</Link>
      
      <div style={navLinksStyle}>
        {keycloak.authenticated ? (
          <>
            <Link 
              to="/admin" 
              style={location.pathname === '/admin' ? activeLinkStyle : linkStyle}
            >
              Admin
            </Link>
            <Link 
              to="/citizen" 
              style={location.pathname === '/citizen' ? activeLinkStyle : linkStyle}
            >
              Citizen
            </Link>
            <Link 
              to="/profile" 
              style={location.pathname === '/profile' ? activeLinkStyle : linkStyle}
            >
              Profile
            </Link>
            
            <div style={userInfoStyle}>
              <span>Bonjour, {keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.name}</span>
              <button 
                onClick={() => keycloak.logout()} 
                style={buttonStyle}
              >
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={() => keycloak.login()} 
              style={buttonStyle}
            >
              Connexion
            </button>
            <button 
              onClick={() => keycloak.register()} 
              style={registerButtonStyle}
            >
              Inscription
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;