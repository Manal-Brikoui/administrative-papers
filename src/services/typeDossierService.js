// src/services/typeDossierService.js
import axios from 'axios';
import keycloak from '../config/keycloak';

const apiUrl = 'http://localhost:5018/api/CitizenService/TypeDossier'; // 🔑 adapter à ton controller backend

// --- Rafraîchir le token Keycloak avant chaque requête ---
const ensureToken = async () => {
  if (!keycloak.authenticated) {
    throw new Error("Utilisateur non authentifié !");
  }
  try {
    await keycloak.updateToken(30); // rafraîchit si expiration <30s
  } catch (err) {
    console.error("Erreur lors du rafraîchissement du token:", err);
    throw new Error("Impossible de rafraîchir le token Keycloak");
  }
  if (!keycloak.token) throw new Error("Token JWT invalide !");
};

// --- Récupérer headers avec token Keycloak et userId ---
const getHeaders = () => {
  const token = keycloak.token;
  const userId = keycloak.tokenParsed?.sub;

  if (!token) throw new Error("Token JWT non trouvé !");
  if (!userId) throw new Error("UserId non trouvé dans le token !");

  return {
    'Authorization': `Bearer ${token}`,
    'X-User-Id': userId,
    'Content-Type': 'application/json',
  };
};

// --- Fonction générique Axios ---
const fetchData = async (endpoint = '', method = 'GET', body = null) => {
  await ensureToken();
  try {
    const response = await axios({
      url: endpoint ? `${apiUrl}/${endpoint}` : apiUrl,
      method,
      headers: getHeaders(),
      data: body,
    });
    return response.data ?? [];
  } catch (error) {
    if (error.response) {
      console.error("Erreur API TypeDossier:", error.response.data?.message || error.response.statusText);
    } else if (error.request) {
      console.error("Aucune réponse reçue de l'API TypeDossier");
    } else {
      console.error("Erreur Axios TypeDossier:", error.message);
    }
    throw error;
  }
};

// --- Fonctions CRUD pour TypeDossier ---
export const getTypeDossiers = async () => fetchData('', 'GET');
export const getTypeDossierById = async (id) => fetchData(id, 'GET');
export const addTypeDossier = async (typeDossier) => fetchData('', 'POST', typeDossier);
export const updateTypeDossier = async (id, typeDossier) => fetchData(id, 'PUT', typeDossier);
export const deleteTypeDossier = async (id) => fetchData(id, 'DELETE');
