import React from "react";

const HomePage = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 90px)", 
    backgroundColor: "#eb6a0eff",
    padding: "1rem",
  };

  const textStyle = {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#000000", 
    fontWeight: "500",
    fontStyle: "italic", 
    padding: "1rem 2rem",
    maxWidth: "700px",
    lineHeight: "1.8",
    letterSpacing: "0.5px",
  };

  const highlightStyle = {
    fontWeight: "700",      
    fontSize: "1.6rem",    
    color: "#040404ff",       
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
