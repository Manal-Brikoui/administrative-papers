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


  const isAuthenticated = keycloak?.authenticated || false;
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const isAdmin = isAuthenticated && roles.includes("admin");
  const isCitizen = isAuthenticated && roles.includes("citizen");


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
   
      <Navbar />

      <Routes>

        <Route path="/" element={<HomePage />} />

   
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
