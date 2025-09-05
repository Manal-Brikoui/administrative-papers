const apiUrl = 'http://localhost:5018/api/Rendezvous'; // URL de votre backend API

// Fonction pour créer un rendez-vous
export const createRendezvous = async (rendezvous) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rendezvous),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la création du rendez-vous');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    throw error;
  }
};

// Fonction pour valider ou refuser un rendez-vous
export const validateRendezvous = async (id, status) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${id}/validate`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la validation du rendez-vous');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la validation du rendez-vous:', error);
    throw error;
  }
};

// Fonction pour récupérer un rendez-vous par ID
export const getRendezvousById = async (id) => {
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
      throw new Error('Rendez-vous introuvable');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    throw error;
  }
};

// Fonction pour supprimer un rendez-vous
export const deleteRendezvous = async (id) => {
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
      throw new Error('Erreur lors de la suppression du rendez-vous');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    throw error;
  }
};
