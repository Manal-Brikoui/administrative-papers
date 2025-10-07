import React from "react";

const HomePage = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 90px)", // moins la hauteur du Navbar
    backgroundColor: "#eb6a0eff",
    padding: "1rem",
  };

  const textStyle = {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#000000", // texte en noir
    fontWeight: "500",
    fontStyle: "italic", // texte en italique
    padding: "1rem 2rem",
    maxWidth: "700px",
    lineHeight: "1.8",
    letterSpacing: "0.5px",
  };

  const highlightStyle = {
    fontWeight: "700",      // mettre en gras
    fontSize: "1.6rem",     // légèrement plus grand
    color: "#040404ff",       // couleur orange SmartBerkane
  };

  return (
    <div style={containerStyle}>
      <div style={textStyle}>
        "{/* ajouter les guillemets ici */}
        Bienvenue sur <span style={highlightStyle}>SmartBerkane</span>, la plateforme innovante qui simplifie la gestion de vos documents administratifs, la prise de rendez-vous et le suivi de vos dossiers en toute transparence."
      </div>
    </div>
  );
};

export default HomePage;
