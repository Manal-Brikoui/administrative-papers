import axios from 'axios';
import keycloak from '../config/keycloak';

const apiUrl = 'http://localhost:5018/api/CitizenService/DossierAdministratif';


const ensureToken = async () => {
  if (!keycloak.authenticated) throw new Error("Utilisateur non authentifié !");
  try {
    // Rafraîchit le token si son expiration est inférieure à 30 secondes
    await keycloak.updateToken(30);
  } catch (err) {
    console.error(" Erreur lors du rafraîchissement du token:", err);
    throw new Error("Échec du rafraîchissement du token");
  }
  if (!keycloak.token) throw new Error("Token invalide !");
};


const getHeaders = () => {
  const token = keycloak.token;
  const userId = keycloak.tokenParsed?.sub;
  if (!token) throw new Error("Token JWT non trouvé !");

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  if (userId) headers['X-User-Id'] = userId; 

  console.log(" Headers envoyés:", headers); 
  return headers;
};

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
    handleApiError(error);
    throw error;
  }
};


const handleApiError = (error) => {
  if (error.response) {
    console.error(" Erreur API:", 
      error.response.data?.error || 
      error.response.data?.message || 
      error.response.statusText
    );
  } else if (error.request) {
    console.error(" Aucune réponse reçue de l'API");
  } else {
    console.error(" Erreur Axios:", error.message);
  }
};



// Récupérer tous les dossiers
export const getDossiers = async () => fetchData('', 'GET');

// Récupérer un dossier par Id
export const getDossierById = async (id) => fetchData(id, 'GET');

// Ajouter un dossier
export const addDossier = async (dossier) => {
  if (!dossier.typeDossierId) {
    throw new Error("typeDossierId est obligatoire pour créer un dossier.");
  }
  return fetchData('', 'POST', dossier);
};

// Mettre à jour un dossier
export const updateDossier = async (id, dossier) => {
  if (!id) throw new Error("Id du dossier est obligatoire pour la mise à jour.");
  return fetchData(`${id}`, 'PUT', dossier);
};

// Supprimer un dossier
export const deleteDossier = async (id) => fetchData(id, 'DELETE');

//  Ajouter un document à un dossier
export const addDocumentToDossier = async (dossierId, document) => {
  if (!document.type || !document.filePath) {
    throw new Error("type et filePath sont obligatoires pour ajouter un document.");
  }
  return fetchData(`${dossierId}/documents`, 'POST', document);
};
