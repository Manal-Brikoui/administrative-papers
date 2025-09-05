const API_URL = 'http://localhost:5018/api/CitizenService/Citizen'; // Base URL pour l'API

// === Récupérer les informations du citoyen ===
export const getCitizenInfo = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/citizen-info`, {
            method: 'GET',
            headers: {
                'X-User-Id': userId,  // En-tête avec l'ID de l'utilisateur
                'Authorization': `Bearer ${token}`,  // Le token d'authentification
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;  // Retourne les informations du citoyen
    } catch (error) {
        console.error("Error fetching citizen info", error);
        throw error;  // On lance l'erreur pour pouvoir la gérer ailleurs
    }
};

// === Récupérer les dossiers du citoyen ===
export const getCitizenDossiers = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/dossiers`, {
            method: 'GET',
            headers: {
                'X-User-Id': userId,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;  // Retourne les dossiers du citoyen
    } catch (error) {
        console.error("Error fetching citizen dossiers", error);
        throw error;
    }
};

// === Récupérer les notifications du citoyen ===
export const getCitizenNotifications = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/notifications`, {
            method: 'GET',
            headers: {
                'X-User-Id': userId,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;  // Retourne les notifications
    } catch (error) {
        console.error("Error fetching citizen notifications", error);
        throw error;
    }
};
