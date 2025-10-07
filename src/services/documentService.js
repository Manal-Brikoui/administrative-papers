// src/services/documentService.js
import axios from "axios";
import keycloak from "../config/keycloak";

const apiDocumentUrl = "http://localhost:5018/api/CitizenService/Document";

// === Rafraîchir le token Keycloak avant chaque requête ===
const ensureToken = async () => {
  if (!keycloak.authenticated) throw new Error("Utilisateur non authentifié !");
  try {
    await keycloak.updateToken(30);
  } catch (err) {
    console.error("Erreur lors du rafraîchissement du token:", err);
    throw new Error("Impossible de rafraîchir le token Keycloak");
  }
  if (!keycloak.token) throw new Error("Token JWT invalide !");
};

// === Récupérer headers avec token Keycloak et userId ===
const getHeaders = () => ({
  Authorization: `Bearer ${keycloak.token}`,
  "X-User-Id": keycloak.tokenParsed?.sub || "",
  "Content-Type": "application/json",
});

// ==================== Documents ====================

// --- Lire tous les documents ---
export const getDocuments = async () => {
  await ensureToken();
  const res = await axios.get(apiDocumentUrl, { headers: getHeaders() });
  return res.data;
};

// --- Lire un document par ID ---
export const getDocumentById = async (id) => {
  await ensureToken();
  const res = await axios.get(`${apiDocumentUrl}/${id}`, { headers: getHeaders() });
  return res.data;
};

// --- Ajouter un document ---
export const addDocument = async (document) => {
  await ensureToken();
  if (!document.type || !document.dossierAdministratifId) {
    throw new Error("Type et DossierAdministratifId sont requis.");
  }

  const payload = {
    Type: document.type,
    DossierAdministratifId: document.dossierAdministratifId,
    FilePath: document.filePath || "",
    IsOnPlatform: document.isOnPlatform || false,
    ImportLocation: document.importLocation || "",
    UserId: keycloak.tokenParsed?.sub || "",
    UploadDate: document.uploadDate || new Date().toISOString(),
  };

  const res = await axios.post(apiDocumentUrl, payload, { headers: getHeaders() });
  return res.data;
};

// --- Mettre à jour un document ---
export const updateDocument = async (id, document) => {
  await ensureToken();

  const payload = {
    Id: id,
    Type: document.type,
    DossierAdministratifId: document.dossierAdministratifId,
    FilePath: document.filePath || "",
    IsOnPlatform: document.isOnPlatform || false,
    ImportLocation: document.importLocation || "",
    UserId: keycloak.tokenParsed?.sub || "",
    UploadDate: document.uploadDate || new Date().toISOString(),
  };

  const res = await axios.put(`${apiDocumentUrl}/${id}`, payload, { headers: getHeaders() });
  return res.data;
};

// --- Supprimer un document ---
export const deleteDocument = async (id) => {
  await ensureToken();
  const res = await axios.delete(`${apiDocumentUrl}/${id}`, { headers: getHeaders() });
  return res.data;
};
