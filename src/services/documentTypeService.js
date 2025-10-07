// src/services/documentTypeService.js
import axios from "axios";
import keycloak from "../config/keycloak";

const apiDocumentTypeUrl = "http://localhost:5018/api/CitizenService/DocumentType";

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

const getHeaders = () => ({
  Authorization: `Bearer ${keycloak.token}`,
  "X-User-Id": keycloak.tokenParsed?.sub || "",
  "Content-Type": "application/json",
});

// ==================== DocumentType ====================

export const getDocumentTypes = async () => {
  await ensureToken();
  const res = await axios.get(apiDocumentTypeUrl, { headers: getHeaders() });
  return res.data;
};

export const getDocumentTypeById = async (id) => {
  await ensureToken();
  const res = await axios.get(`${apiDocumentTypeUrl}/${id}`, { headers: getHeaders() });
  return res.data;
};

export const addDocumentType = async (docType) => {
  await ensureToken();

  if (!docType.name || !docType.categoryId || !docType.typeDossierId) {
    throw new Error("Name, CategoryId et TypeDossierId sont requis !");
  }

  const payload = {
    id: docType.id || "00000000-0000-0000-0000-000000000000", // backend génère un nouvel ID
    name: docType.name.trim(),
    isImportable: docType.isImportable ?? false,
    category: docType.category || "",
    categoryId: docType.categoryId,
    typeDossierId: docType.typeDossierId,
  };

  console.log("Payload addDocumentType:", payload);

  const res = await axios.post(apiDocumentTypeUrl, payload, { headers: getHeaders() });
  return res.data;
};

export const updateDocumentType = async (id, docType) => {
  await ensureToken();

  if (!docType.name || !docType.categoryId || !docType.typeDossierId) {
    throw new Error("Name, CategoryId et TypeDossierId sont requis !");
  }

  const payload = {
    id: id,
    name: docType.name.trim(),
    isImportable: docType.isImportable ?? false,
    category: docType.category || "",
    categoryId: docType.categoryId,
    typeDossierId: docType.typeDossierId,
  };

  console.log("Payload updateDocumentType:", payload);

  const res = await axios.put(`${apiDocumentTypeUrl}/${id}`, payload, { headers: getHeaders() });
  return res.data;
};

export const deleteDocumentType = async (id) => {
  await ensureToken();
  const res = await axios.delete(`${apiDocumentTypeUrl}/${id}`, { headers: getHeaders() });
  return res.data;
};
