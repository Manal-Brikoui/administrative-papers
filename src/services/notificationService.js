// src/services/notificationService.js
import axios from 'axios';
import keycloak from '../config/keycloak';

const apiUrl = 'http://localhost:5018/api/CitizenService/Notification'; // 🔑 adapter à ton controller backend

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
            console.error("Erreur API Notification:", error.response.data?.message || error.response.statusText);
        } else if (error.request) {
            console.error("Aucune réponse reçue de l'API Notification");
        } else {
            console.error("Erreur Axios Notification:", error.message);
        }
        throw error;
    }
};

// --- Fonctions CRUD pour Notification ---
export const getNotifications = async () => fetchData('', 'GET');
export const getNotificationById = async (id) => fetchData(id, 'GET');
export const addNotification = async (notification) => fetchData('', 'POST', notification);
export const updateNotification = async (id, notification) => fetchData(id, 'PUT', notification);
export const deleteNotification = async (id) => fetchData(id, 'DELETE');
