
import { useKeycloak } from '@react-keycloak/web';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo1.jpg';

const Navbar = () => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();

  const navStyle = {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  };

  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#000000',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  };

  const logoStyle = { height: '140px' };

  const navLinksStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginTop: '0.5rem',
    flexWrap: 'wrap'
  };

 
  const linkStyle = {
    color: '#000000', 
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#398b19ff',
    color: '#ffffff'
  };

  // Styles des boutons
  const loginButtonStyle = {
    backgroundColor: '#27ae60', // vert
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'background-color 0.3s'
  };

  const registerButtonStyle = {
    backgroundColor: '#e77715ff', // orange
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'background-color 0.3s'
  };

  const logoutButtonStyle = {
    backgroundColor: '#e74c3c', // rouge
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    transition: 'background-color 0.3s'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#000000'
  };

  if (!initialized) {
    return (
      <nav style={navStyle}>
        <Link to="/" style={brandStyle}>
          <img src={logo} alt="Logo SmartBerkane" style={logoStyle} />
          SmartBerkane
        </Link>
      </nav>
    );
  }

  const roles = keycloak.tokenParsed?.realm_access?.roles || [];
  const isAdmin = roles.includes('admin');
  const isCitizen = roles.includes('citizen');

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>
        <img src={logo} alt="Logo SmartBerkane" style={logoStyle} />
        SmartBerkane
      </Link>

      <div style={navLinksStyle}>
        {keycloak.authenticated ? (
          <>
            {isAdmin && (
              <Link
                to="/admin"
                style={location.pathname === '/admin' ? activeLinkStyle : linkStyle}
              >
                Admin
              </Link>
            )}
            {isCitizen && (
              <Link
                to="/citizen"
                style={location.pathname === '/citizen' ? activeLinkStyle : linkStyle}
              >
                Citizen
              </Link>
            )}

            <Link
              to="/profile"
              style={location.pathname === '/profile' ? activeLinkStyle : linkStyle}
            >
              Profile
            </Link>

            <div style={userInfoStyle}>
              <span>Bonjour, {keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.name}</span>
              <button onClick={() => keycloak.logout()} style={logoutButtonStyle}>
                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => keycloak.login()} style={loginButtonStyle}>
              Connexion
            </button>
            <button onClick={() => keycloak.register()} style={registerButtonStyle}>
              Inscription
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
