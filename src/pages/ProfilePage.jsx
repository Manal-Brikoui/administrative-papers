import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profilIcon from '../assets/profil.png';
import { getAuthHeaders } from '../services/authService';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [updatedData, setUpdatedData] = useState({ firstName: '', lastName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5018/api/CitizenService/Authentication/user-info', {
        headers: getAuthHeaders(),
      });
      setUserInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Erreur de récupération du profil');
      setLoading(false);
    }
  };

  const updateUserProfile = async () => {
    if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
      setError('Tous les champs doivent être remplis');
      return;
    }
    try {
      const response = await axios.put('http://localhost:5018/api/CitizenService/Authentication/update-profile', updatedData, {
        headers: getAuthHeaders(),
      });
      setUserInfo(response.data.user);
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  const changePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('Tous les champs de mot de passe doivent être remplis');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    try {
      await axios.put(
        'http://localhost:5018/api/CitizenService/Authentication/change-password',
        { oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword },
        { headers: getAuthHeaders() }
      );
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Mot de passe modifié avec succès !');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du changement de mot de passe');
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5018/api/CitizenService/Authentication/logout', null, {
        headers: getAuthHeaders(),
      });
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
      setError('Erreur de déconnexion');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  if (loading) return <div>Chargement du profil...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Phrase d’accueil */}
      {/* Phrase d’accueil */}
<div style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#180f01ff', fontWeight: 'bold' }}>
  Mettez à jour vos informations personnelles pour garder votre compte SmartBerkane à jour et sécurisé.
</div>
  

      {/* Profil Section */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#0f0601' }}>
          <img src={profilIcon} alt="Profil" style={{ width: '32px', height: '32px' }} />
          Profil de l'utilisateur
        </h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#7f8c8d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nom d'utilisateur</div>
            <div style={{ color: '#2c3e50', fontSize: '1.1rem' }}>{userInfo.userName || 'Non spécifié'}</div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#7f8c8d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nom complet</div>
            <div style={{ color: '#2c3e50', fontSize: '1.1rem' }}>
              <input type="text" name="firstName" value={updatedData.firstName || userInfo.firstName} onChange={handleInputChange} style={inputStyle} />
              <input type="text" name="lastName" value={updatedData.lastName || userInfo.lastName} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <div style={{ fontWeight: 'bold', color: '#7f8c8d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</div>
            <div>
              <input type="email" name="email" value={updatedData.email || userInfo.email} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '6px', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 'bold', color: '#7f8c8d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mot de passe</div>
          <input type="password" name="oldPassword" placeholder="Ancien mot de passe" value={passwordData.oldPassword} onChange={handlePasswordChange} style={inputStyle} />
          <input type="password" name="newPassword" placeholder="Nouveau mot de passe" value={passwordData.newPassword} onChange={handlePasswordChange} style={inputStyle} />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={passwordData.confirmPassword} onChange={handlePasswordChange} style={inputStyle} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={updateUserProfile} style={buttonStyle('#ff9800')}>Modifier le profil</button>
          <button onClick={changePassword} style={buttonStyle('#27ae60')}>Changer le mot de passe</button>
          <button onClick={logout} style={buttonStyle('#e74c3c')}>Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

// Styles réutilisables
const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  marginBottom: '0.5rem',
  border: '1px solid #ccc',
};

const buttonStyle = (bgColor) => ({
  padding: '0.8rem 1.5rem',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});

export default ProfilePage;
