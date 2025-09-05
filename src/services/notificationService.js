const apiUrl = 'http://localhost:5018/api/Notification'; // URL de votre backend API

// Fonction pour récupérer toutes les notifications
export const getNotifications = async () => {
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
      throw new Error('Failed to fetch notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Fonction pour récupérer une notification par ID
export const getNotificationById = async (id) => {
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
      throw new Error('Notification not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notification by ID:', error);
    throw error;
  }
};

// Fonction pour créer une nouvelle notification (admin uniquement)
export const createNotification = async (notification) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Fonction pour mettre à jour une notification (admin uniquement)
export const updateNotification = async (id, updatedNotification) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNotification),
    });

    if (!response.ok) {
      throw new Error('Failed to update notification');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

// Fonction pour supprimer une notification (admin uniquement)
export const deleteNotification = async (id) => {
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
      throw new Error('Failed to delete notification');
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

