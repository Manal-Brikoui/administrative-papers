const apiUrl = 'http://localhost:5018/api/CitizenService/Category'; // Mise à jour avec l'URL correcte

// Fonction pour récupérer les headers avec le token JWT
const getHeaders = () => {
    const token = localStorage.getItem('access_token'); // Récupérer le token JWT
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

// Récupérer toutes les catégories
export const getCategories = async () => {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'GET',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Category not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
};

// Ajouter une catégorie
export const addCategory = async (category) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(category),
        });
        if (!response.ok) {
            throw new Error('Failed to add category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

// Mettre à jour une catégorie
export const updateCategory = async (id, category) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(category),
        });
        if (!response.ok) {
            throw new Error('Failed to update category');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

// Supprimer une catégorie
export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete category');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};
