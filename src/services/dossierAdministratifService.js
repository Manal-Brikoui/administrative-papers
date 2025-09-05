const apiUrl = 'http://localhost:5018/api/DossierAdministratif'; // URL de votre backend API

// Fonction pour récupérer tous les dossiers d'un utilisateur (citizen/admin)
export const getDossiers = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dossiers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    throw error;
  }
};

// Fonction pour récupérer un dossier par son ID
export const getDossierById = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Dossier not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dossier by ID:', error);
    throw error;
  }
};

// Fonction pour ajouter un dossier administratif
export const addDossier = async (dossier) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dossier),
    });

    if (!response.ok) {
      throw new Error('Failed to add dossier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding dossier:', error);
    throw error;
  }
};

// Fonction pour supprimer un dossier
export const deleteDossier = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete dossier');
    }
  } catch (error) {
    console.error('Error deleting dossier:', error);
    throw error;
  }
};

// Fonction pour ajouter un document à un dossier
export const addDocumentToDossier = async (dossierId, document) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${dossierId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error('Failed to add document to dossier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding document to dossier:', error);
    throw error;
  }
};
