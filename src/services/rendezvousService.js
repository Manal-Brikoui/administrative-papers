import axios from 'axios';
import keycloak from '../config/keycloak';

const apiUrl = 'http://localhost:5018/api/CitizenService/Rendezvous';


const ensureToken = async () => {
  if (!keycloak.authenticated) throw new Error("Utilisateur non authentifié !");
  try {
    await keycloak.updateToken(30); // rafraîchit si expiration < 30s
  } catch (err) {
    console.error(" Erreur rafraîchissement token:", err);
    throw new Error("Impossible de rafraîchir le token Keycloak");
  }
  if (!keycloak.token) throw new Error("Token JWT invalide !");
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
    if (error.response) {
      console.error(
        " Erreur API Rendezvous:",
        error.response.data?.error || error.response.data?.message || error.response.statusText
      );
    } else if (error.request) {
      console.error(" Aucune réponse reçue de l'API Rendezvous");
    } else {
      console.error(" Erreur Axios Rendezvous:", error.message);
    }
    throw error;
  }
};



// Créer un rendez-vous 
export const addRendezvous = async (rendezvous) => {
  if (!rendezvous.typeDossierId) throw new Error("typeDossierId est obligatoire.");
  if (!rendezvous.appointmentDate) throw new Error("appointmentDate est obligatoire.");


  const payload = {
    typeDossierId: rendezvous.typeDossierId,
    appointmentDate: rendezvous.appointmentDate,
  };

  return fetchData('', 'POST', payload);
};

// Récupérer un rendez-vous par ID
export const getRendezvousById = async (id) => fetchData(`${id}`, 'GET');

// Récupérer tous les rendez-vous 
export const getAllRendezvous = async () => fetchData('', 'GET');

// Valider ou refuser un rendez-vous 
export const validateRendezvous = async (id, status) => {
  const validStatus = ["validé", "refusé"];
  if (!validStatus.includes(status)) throw new Error(`Le statut doit être: ${validStatus.join(', ')}`);

 

  return fetchData(`${id}/validate`, 'PUT', JSON.stringify(status));
};

// Supprimer un rendez-vous
export const deleteRendezvous = async (id) => fetchData(`${id}`, 'DELETE');
