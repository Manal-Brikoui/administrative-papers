
import axios from "axios";
import keycloak from "../config/keycloak";

const API_URL = "http://localhost:5018/api/CitizenService/Citizen";


const ensureToken = async () => {
  if (!keycloak.authenticated) throw new Error("Utilisateur non authentifié !");
  try {
    await keycloak.updateToken(30); 
  } catch (err) {
    console.error(" Erreur lors du refresh du token:", err);
    throw new Error("Échec du rafraîchissement du token");
  }
  if (!keycloak.token) throw new Error("Token invalide !");
};

 
const getHeaders = () => {
  const token = keycloak.token;
  const userId = keycloak.tokenParsed?.sub;
  if (!token) throw new Error("Token manquant !");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

 
  if (userId) headers["X-User-Id"] = userId;

 
  console.log(" Token envoyé:", token?.substring(0, 20) + "...");
  console.log(" Roles:", keycloak.tokenParsed?.realm_access?.roles || []);
  console.log(" Headers:", headers);

  return headers;
};


const fetchData = async (endpoint, method = "GET", body = null) => {
  await ensureToken();
  try {
    const res = await axios({
      url: `${API_URL}/${endpoint}`,
      method,
      headers: getHeaders(),
      data: body,
    });

 
    if (Array.isArray(res.data)) return res.data;
    return res.data ?? [];
  } catch (err) {
    console.error(
      " Erreur API :",
      err.response?.data || err.response?.statusText || err.message
    );
    throw err; 
  }
};


export const getCitizenInfo = async () => fetchData("citizen-info", "GET");
export const getCitizenDossiers = async () => fetchData("dossiers", "GET");
export const getCitizenNotifications = async () =>
  fetchData("notifications", "GET");
