const apiUrl = 'http://localhost:5018/api/Document'; // URL de votre backend API

// Fonction pour récupérer les documents de l'utilisateur authentifié ou de l'administrateur
export const getDocuments = async () => {
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
      throw new Error('Failed to fetch documents');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Fonction pour récupérer un document par son ID
export const getDocumentById = async (documentId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${documentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Document not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching document by ID:', error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau document
export const addDocument = async (document) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error('Failed to add document');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un document
export const updateDocument = async (documentId, document) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${documentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Fonction pour supprimer un document
export const deleteDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};
