// src/services/citizenServices.js
import axios from "axios";
import keycloak from "../config/keycloak";

const API_URL = "http://localhost:5018/api/CitizenService/Citizen";

// --- Rafraîchir le token Keycloak avant chaque requête ---
const ensureToken = async () => {
  if (!keycloak.authenticated) throw new Error("Utilisateur non authentifié !");
  try {
    await keycloak.updateToken(30); // refresh si <30s
  } catch (err) {
    console.error("❌ Erreur lors du refresh du token:", err);
    throw new Error("Échec du rafraîchissement du token");
  }
  if (!keycloak.token) throw new Error("Token invalide !");
};

// --- Récupérer les headers avec token (X-User-Id optionnel) ---
const getHeaders = () => {
  const token = keycloak.token;
  const userId = keycloak.tokenParsed?.sub;
  if (!token) throw new Error("Token manquant !");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Ajoute X-User-Id seulement si dispo
  if (userId) headers["X-User-Id"] = userId;

  // 🔍 Debug (peut être commenté en prod)
  console.log("➡️ Token envoyé:", token?.substring(0, 20) + "...");
  console.log("➡️ Roles:", keycloak.tokenParsed?.realm_access?.roles || []);
  console.log("➡️ Headers:", headers);

  return headers;
};

// --- Fonction générique pour les appels API ---
const fetchData = async (endpoint, method = "GET", body = null) => {
  await ensureToken();
  try {
    const res = await axios({
      url: `${API_URL}/${endpoint}`,
      method,
      headers: getHeaders(),
      data: body,
    });

    // ✅ Toujours retourner un tableau si possible
    if (Array.isArray(res.data)) return res.data;
    return res.data ?? [];
  } catch (err) {
    console.error(
      "❌ Erreur API :",
      err.response?.data || err.response?.statusText || err.message
    );
    throw err; // <-- mieux de propager l’erreur pour la gérer dans la page
  }
};

// --- Fonctions spécifiques pour le citoyen ---
export const getCitizenInfo = async () => fetchData("citizen-info", "GET");
export const getCitizenDossiers = async () => fetchData("dossiers", "GET");
export const getCitizenNotifications = async () =>
  fetchData("notifications", "GET");
