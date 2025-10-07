import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import CitizenPage from "./pages/CitizenPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { useKeycloak } from "@react-keycloak/web";

function App() {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Chargement de l’authentification...</div>;
  }

  // ✅ Vérification du login et des rôles
  const isAuthenticated = keycloak?.authenticated || false;
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const isAdmin = isAuthenticated && roles.includes("admin");
  const isCitizen = isAuthenticated && roles.includes("citizen");

  // 🔍 Debug - affiche les rôles dans la console
  console.log("Utilisateur connecté:", isAuthenticated);
  console.log("Rôles reçus:", roles);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ✅ Navbar toujours visible */}
      <Navbar />

      <Routes>
        {/* Route publique */}
        <Route path="/" element={<HomePage />} />

        {/* Route Admin protégée */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminPage />
            ) : (
              <>
                {console.warn("Accès refusé : rôle admin manquant")}
                <Navigate to="/" replace />
              </>
            )
          }
        />

        {/* Route Citizen protégée */}
        <Route
          path="/citizen"
          element={
            isCitizen ? (
              <CitizenPage />
            ) : (
              <>
                {console.warn("Accès refusé : rôle citizen manquant")}
                <Navigate to="/" replace />
              </>
            )
          }
        />

        {/* Page Profile (accessible seulement si connecté) */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Redirection fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;