import React from "react";
import ReactDOM from "react-dom/client";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import keycloak from "./config/keycloak";

const handleOnEvent = (event) => {
  if (event === "onAuthSuccess") {
    console.log("Authentification réussie");
  }
};

const loadingComponent = (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "20px",
      color: "#2c3e50",
    }}
  >
    Chargement...
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={handleOnEvent}
    LoadingComponent={loadingComponent}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ReactKeycloakProvider>
);
