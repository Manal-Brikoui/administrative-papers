import axios from 'axios';
import keycloak from '../config/keycloak';  // Assurez-vous que le chemin est correct

const API_URL = 'http://localhost:5018/api/CitizenService/Authentication';  // Remplacer par l'URL de ton API

// Fonction pour vérifier si le jeton Keycloak est valide et obtenir les headers
export const getAuthHeaders = () => {
  const token = keycloak.token;

  if (!token) {
    throw new Error('Jeton d\'authentification manquant');
  }

  // Assurez-vous que le jeton est valide avant de l'envoyer
  if (keycloak.isTokenExpired()) {
    // Optionnel : Rediriger l'utilisateur pour se reconnecter si le jeton est expiré
    keycloak.login();
    throw new Error('Jeton expiré, redirection vers la page de connexion');
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Service pour obtenir les informations de l'utilisateur authentifié
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-info`, {
      headers: getAuthHeaders(),
    });
    return response.data;  // Retourne les informations utilisateur
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    throw new Error('Impossible de récupérer les informations utilisateur.');
  }
};

// Service pour mettre à jour les informations du profil de l'utilisateur
export const updateUserProfile = async (updatedProfile) => {
  try {
    const response = await axios.put(`${API_URL}/update-profile`, updatedProfile, {
      headers: getAuthHeaders(),
    });
    return response.data;  // Retourne la réponse de l'API après mise à jour du profil
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw new Error('Impossible de mettre à jour le profil.');
  }
};

// Service pour changer le mot de passe de l'utilisateur
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_URL}/change-password`, passwordData, {
      headers: getAuthHeaders(),
    });
    return response.data;  // Retourne la réponse de l'API après changement du mot de passe
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw new Error('Impossible de changer le mot de passe.');
  }
};

// Service pour se déconnecter
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, null, {
      headers: getAuthHeaders(),
    });
    keycloak.logout();  // Se déconnecte de Keycloak
    return { message: 'Déconnexion réussie' };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw new Error('Erreur lors de la déconnexion.');
  }
};

// Service pour la connexion (redirige l'utilisateur vers Keycloak)
export const login = async () => {
  try {
    keycloak.login();  // Redirige l'utilisateur vers Keycloak
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw new Error('Erreur lors de la tentative de connexion.');
  }
};

// Service pour récupérer les informations après la redirection de Keycloak
export const redirectToKeycloak = async () => {
  try {
    // Vérifie si Keycloak est déjà prêt et si l'utilisateur est authentifié
    if (keycloak.authenticated) {
      return { message: 'Utilisateur déjà authentifié' };
    }
    // Redirige l'utilisateur vers Keycloak si nécessaire
    keycloak.login();
  } catch (error) {
    console.error('Erreur lors de la récupération des informations de redirection Keycloak:', error);
    throw new Error('Erreur lors de la redirection vers Keycloak.');
  }
};
