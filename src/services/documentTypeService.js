const apiUrl = 'http://localhost:5018/api/DocumentType'; // URL de votre backend API

// Fonction pour récupérer tous les types de documents
export const getDocumentTypes = async () => {
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
      throw new Error('Failed to fetch document types');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching document types:', error);
    throw error;
  }
};

// Fonction pour récupérer un type de document par son ID
export const getDocumentTypeById = async (id) => {
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
      throw new Error('Document type not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching document type by ID:', error);
    throw error;
  }
};

// Fonction pour ajouter un type de document
export const addDocumentType = async (documentType) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentType),
    });

    if (!response.ok) {
      throw new Error('Failed to add document type');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding document type:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un type de document
export const updateDocumentType = async (id, documentType) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentType),
    });

    if (!response.ok) {
      throw new Error('Failed to update document type');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating document type:', error);
    throw error;
  }
};

// Fonction pour supprimer un type de document
export const deleteDocumentType = async (id) => {
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
      throw new Error('Failed to delete document type');
    }
  } catch (error) {
    console.error('Error deleting document type:', error);
    throw error;
  }
};
