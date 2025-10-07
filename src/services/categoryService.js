import axios from 'axios';
import keycloak from '../config/keycloak';

const apiUrl = 'http://localhost:5018/api/CitizenService/Category';

// --- Récupérer les headers avec le token Keycloak ---
const getHeaders = () => {
  if (!keycloak.authenticated || !keycloak.token) {
    console.error('Token JWT non trouvé dans Keycloak !');
    throw new Error('Token JWT non trouvé');
  }
  return {
    'Authorization': `Bearer ${keycloak.token}`,
    'Content-Type': 'application/json',
  };
};

// --- Fonction générique pour requêtes Axios ---
const fetchData = async (url, method, body = null) => {
  try {
    const response = await axios({
      url,
      method,
      headers: getHeaders(),
      data: body,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Erreur API :', error.response.data?.message || error.response.statusText);
    } else if (error.request) {
      console.error('Aucune réponse reçue de l\'API');
    } else {
      console.error('Erreur Axios :', error.message);
    }
    throw error;
  }
};

// --- CRUD Categories ---
export const getCategories = async () => fetchData(apiUrl, 'GET');
export const getCategoryById = async (id) => fetchData(`${apiUrl}/${id}`, 'GET');
export const addCategory = async (category) => fetchData(apiUrl, 'POST', category);
export const updateCategory = async (id, category) => fetchData(`${apiUrl}/${id}`, 'PUT', category);
export const deleteCategory = async (id) => fetchData(`${apiUrl}/${id}`, 'DELETE');
