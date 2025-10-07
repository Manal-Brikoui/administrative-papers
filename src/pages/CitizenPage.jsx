import React, { useEffect, useState } from "react";
import keycloak from "../config/keycloak";
import Sidebar from "../components/Sidebar";
import categoryIcon from "../assets/category.png";
import "./citizen.css";
import folderIcon from "../assets/folder.png";
import dossierIcon from "../assets/dossier.png";
import trashIcon from "../assets/trash-can-black-symbol.png";
import documentationIcon from "../assets/documentation.png";
import fileIcon from "../assets/file.png";
import userIcon from "../assets/user.png";
import mesDossiersIcon  from "../assets/mesdossiers.png";
import calendarIcon from "../assets/schedule.png";
import checkIcon from "../assets/check.png";
import crossIcon from "../assets/cross.png";

import {
  getDossiers,
  addDossier,
  deleteDossier,
} from "../services/dossierAdministratifService";
import {
  getCitizenInfo,
  getCitizenDossiers,
  getCitizenNotifications,
} from "../services/citizenServices";

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/documentService";

import { getDocumentTypes } from "../services/documentTypeService";
import { getCategories, getCategoryById } from "../services/categoryService";
import { getTypeDossiers } from "../services/typeDossierService";
import { getNotifications, deleteNotification } from "../services/notificationService";

// ✅ Import rendezvous service
import {
  addRendezvous,
  getRendezvousById,
  getAllRendezvous,
  deleteRendezvous,
} from "../services/rendezvousService";

const CitizenPage = () => {
  // === States principaux ===
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeDossiers, setTypeDossiers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Active section pour Sidebar
  const [activeSection, setActiveSection] = useState("dossiers");

  // === State Dossier ===
  const [newDossier, setNewDossier] = useState({
    typeDossierId: "",
    status: "En cours",
    isCompleted: false,
  });

  // === State Document ===
  const [newDocument, setNewDocument] = useState({
    type: "",
    dossierAdministratifId: "",
    filePath: "",
    isOnPlatform: false,
    importLocation: "",
  });
  const [editDocument, setEditDocument] = useState(null);

  // === State Rendezvous ===
  const [appointmentDate, setAppointmentDate] = useState("");
  const [typeDossierId, setTypeDossierId] = useState("");
  const [rendezvousId, setRendezvousId] = useState("");
  const [rendezvous, setRendezvous] = useState(null);
  const [rdvMessage, setRdvMessage] = useState("");
  const [rendezvousList, setRendezvousList] = useState([]);

  // === Infos user ===
  const userId = keycloak?.tokenParsed?.sub || null;
  const isAdmin = keycloak?.tokenParsed?.realm_access?.roles?.includes("admin");

  // === Autres states ===
  const [citizenInfo, setCitizenInfo] = useState(null);
  const [dossiers, setDossiers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Charger données initiales ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!userId) return;

        const [
          allDossiers,
          allDocuments,
          allDocumentTypes,
          allCategories,
          allTypeDossiers,
        ] = await Promise.all([
          getDossiers(),
          getDocuments(),
          getDocumentTypes(),
          getCategories(),
          getTypeDossiers(),
        ]);

        // Filtrer selon l'utilisateur
        setDossiers(allDossiers.filter((d) => d.userId === userId || isAdmin));
        setDocuments(allDocuments.filter((doc) => doc.userId === userId || isAdmin));
        setDocumentTypes(allDocumentTypes);
        setCategories(allCategories);
        setTypeDossiers(allTypeDossiers);
      } catch (err) {
        console.error("❌ Erreur chargement données citoyen :", err);
      } finally {
        setLoading(false);
      }
    };

    if (keycloak.authenticated) fetchData();
  }, [userId, isAdmin]);

  // === Catégorie ===
  const handleSelectCategory = async (id) => {
    try {
      const cat = await getCategoryById(id);
      setSelectedCategory(cat);
    } catch (err) {
      console.error("❌ Erreur chargement catégorie :", err);
    }
  };

  // === Dossier ===
  const handleAddDossier = async () => {
    if (!newDossier.typeDossierId) {
      return alert("Veuillez sélectionner un type de dossier.");
    }
    try {
      const dossier = await addDossier({
        typeDossierId: String(newDossier.typeDossierId),
        status: newDossier.status,
        isCompleted: newDossier.isCompleted,
        userId: userId,
      });
      setDossiers((prev) => [...prev, dossier]);
      setNewDossier({ typeDossierId: "", status: "En cours", isCompleted: false });
    } catch (err) {
      console.error("❌ Erreur ajout dossier :", err);
      alert("Impossible d'ajouter le dossier.");
    }
  };

  const handleDeleteDossier = async (id) => {
    if (!window.confirm("Supprimer ce dossier ?")) return;
    try {
      await deleteDossier(id);
      setDossiers((prev) => prev.filter((d) => d.id !== id));
      setDocuments((prev) => prev.filter((doc) => doc.dossierAdministratifId !== id));
    } catch (err) {
      console.error("❌ Erreur suppression dossier :", err);
    }
  };

  // === Document ===
  const handleAddDocument = async () => {
    if (!newDocument.type || !newDocument.dossierAdministratifId)
      return alert("Veuillez sélectionner un type et un dossier.");
    try {
      const doc = await addDocument({
        type: newDocument.type,
        dossierAdministratifId: newDocument.dossierAdministratifId,
        filePath: newDocument.filePath,
        isOnPlatform: isAdmin ? newDocument.isOnPlatform : false,
        importLocation: isAdmin ? newDocument.importLocation : null,
        userId: userId,
      });
      setDocuments((prev) => [...prev, doc]);
      setNewDocument({
        type: "",
        dossierAdministratifId: "",
        filePath: "",
        isOnPlatform: false,
        importLocation: "",
      });
    } catch (err) {
      console.error("❌ Erreur ajout document :", err);
    }
  };

  const handleEditDocument = (doc) => setEditDocument({ ...doc });

  const handleUpdateDocument = async () => {
    try {
      const updated = {
        ...editDocument,
        isOnPlatform: isAdmin ? editDocument.isOnPlatform : false,
        importLocation: isAdmin ? editDocument.importLocation : null,
        userId: userId,
      };
      await updateDocument(editDocument.id, updated);
      setDocuments((prev) => prev.map((d) => (d.id === editDocument.id ? updated : d)));
      setEditDocument(null);
    } catch (err) {
      console.error("❌ Erreur mise à jour document :", err);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("❌ Erreur suppression document :", err);
    }
  };

  // === Rendezvous ===
  const handleAddRendezvous = async () => {
    if (!appointmentDate || !typeDossierId) {
      return alert("Veuillez choisir un type de dossier et une date.");
    }
    try {
      const rdv = await addRendezvous({
        typeDossierId,
        appointmentDate: new Date(appointmentDate).toISOString(),
      });
      setRendezvous(rdv);
      setRendezvousId(rdv.id);
      setRdvMessage("✅ Rendez-vous créé avec succès !");
    } catch (err) {
      console.error("❌ Erreur ajout rendez-vous:", err);
      setRdvMessage("❌ Impossible de créer le rendez-vous.");
    }
  };

  useEffect(() => {
    const fetchRendezvous = async () => {
      try {
        const allRdv = await getAllRendezvous();
        setRendezvousList(allRdv);
      } catch (err) {
        console.error("Erreur chargement des rendez-vous :", err);
      }
    };

    if (keycloak.authenticated) fetchRendezvous();
  }, []);

  const handleGetRendezvous = async () => {
    try {
      const rdv = await getRendezvousById(rendezvousId);
      setRendezvous(rdv);
      setRdvMessage("ℹ️ Rendez-vous récupéré.");
    } catch (err) {
      console.error("❌ Erreur get rendez-vous:", err);
      setRdvMessage("❌ Impossible de récupérer le rendez-vous.");
    }
  };

  const handleDeleteRendezvous = async () => {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    try {
      await deleteRendezvous(rendezvousId);
      setRendezvous(null);
      setRdvMessage("🗑️ Rendez-vous annulé.");
    } catch (err) {
      console.error("❌ Erreur delete rendez-vous:", err);
      setRdvMessage("❌ Impossible d'annuler le rendez-vous.");
    }
  };

  // === Notifications ===
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifList = await getNotifications();
        setNotifications(notifList);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des notifications :", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleDeleteNotification = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification ?")) {
      try {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      } catch (err) {
        console.error("❌ Erreur lors de la suppression de la notification :", err);
      }
    }
  };

  // === Charger données citoyen ===
  useEffect(() => {
    const loadCitizenData = async () => {
      try {
        const info = await getCitizenInfo();
        const dossierList = await getCitizenDossiers();
        const notifList = await getCitizenNotifications();

        setCitizenInfo(info);
        setDossiers(dossierList);
        setNotifications(notifList);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des données citoyen :", err);
      } finally {
        setLoading(false);
      }
    };

    loadCitizenData();
  }, []);

  if (!keycloak.authenticated)
    return <p>Veuillez vous connecter pour accéder à vos documents.</p>;

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: "20px" }}>
  {/* Sidebar */}
  <Sidebar
    isOpen={isSidebarOpen}
    toggleSidebar={toggleSidebar}
    activeSection={activeSection}
    setActiveSection={setActiveSection}
    notifications={notifications}
    rendezvous={rendezvousList}
  />

  <div className="dashboard-header">
    <h2>
      Bienvenue dans l’espace citoyen de votre plateforme{" "}
      <span>SmartBerkane</span>
    </h2>
  </div>
  <div className="citizen-dashboard">

  {/* 🔹 Infos citoyen */}
  {citizenInfo && (
    <div className="citizen-info-card">
      <h2 className="citizen-info-title">
        <img src={userIcon} alt="Utilisateur" className="user-icon" />
        Mes Informations
      </h2>
      <p><strong>Nom :</strong> {citizenInfo.firstName} {citizenInfo.lastName}</p>
      <p><strong>Email :</strong> {citizenInfo.email}</p>
      <p><strong>Identifiant :</strong> {citizenInfo.userId}</p>
    </div>
  )}

  {/* 🔹 Mes Dossiers */}
  <div className="dossier-card">
    <h2 className="dossier-title">
      <img src={mesDossiersIcon} alt="Mes Dossiers" className="folder-icon" />
      Mes Dossiers
    </h2>

    {dossiers.length === 0 ? (
      <p className="dossier-empty">Aucun dossier trouvé.</p>
    ) : (
      <ul className="dossier-list">
        {dossiers.map((d) => {
          const type = typeDossiers.find((t) => t.id === d.typeDossierId);
          const citizenName = citizenInfo
            ? `${citizenInfo.firstName} ${citizenInfo.lastName}`
            : "Citoyen non défini";

          return (
            <li key={d.id} className="dossier-item">
              <strong>{citizenName}</strong> – Type : {type?.name || "Inconnu"}
            </li>
          );
        })}
      </ul>
    )}
  </div>

</div>



  {/* === Conteneur global horizontal pour Catégories + Dossiers === */}
  <div className="sections-container-horizontal">

    {/* === Catégories === */}
    <div className="categories-section card">
      <h3 className="categories-title">
        <img src={categoryIcon} alt="Catégories" className="icon-small" />
        Catégories disponibles
      </h3>

      <ul className="categories-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <span>{cat.name}</span>
            <button
              className="category-btn"
              onClick={() => handleSelectCategory(cat.id)}
            >
              Voir détails
            </button>
          </li>
        ))}
      </ul>

      {selectedCategory && (
        <div className="category-details">
          <h4>{selectedCategory.name}</h4>
          <p>{selectedCategory.description || "Pas de description"}</p>

          <h5>Types de documents :</h5>
          <ul className="document-types">
            {documentTypes
              .filter((dt) => dt.categoryId === selectedCategory.id)
              .map((dt) => (
                <li key={dt.id} className="document-type">
                  {dt.name} {dt.isImportable ? "📥 (Importable)" : ""}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>

    {/* === Dossiers === */}
    <div className="dossiers-section card">
      <h3 className="dossiers-title">
        <img src={folderIcon} alt="Dossiers" className="icon-small" />
        Mes dossiers administratifs
      </h3>

      <table className="dossiers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Status</th>
            <th>Complété</th>
            <th>Documents</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dossiers.map((d) => {
            const type = typeDossiers.find((t) => t.id === d.typeDossierId);
            const relatedDocs = documents.filter(
              (doc) => doc.dossierAdministratifId === d.id
            );
            return (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{type?.name || d.typeDossierId}</td>
                <td>{d.status}</td>
                <td>{d.isCompleted ? "Oui" : "Non"}</td>
                <td>
                  <ul>
                    {relatedDocs.map((doc) => {
                      const docType = documentTypes.find((dt) => dt.id === doc.type);
                      return (
                        <li key={doc.id}>
                          {docType?.name || doc.type} - {doc.filePath || "N/A"}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDossier(d.id)}
                  >
                    <img src={trashIcon} alt="Supprimer" className="trash-icon" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Formulaire ajout dossier */}
      <div className="ajout-dossier">
        <h4>
          <img src={dossierIcon} alt="Ajouter" className="icon-small" />
          Ajouter un dossier
        </h4>
        <select
          value={newDossier.typeDossierId}
          onChange={(e) =>
            setNewDossier((prev) => ({ ...prev, typeDossierId: e.target.value }))
          }
        >
          <option value="">Sélectionner type dossier</option>
          {typeDossiers.map((td) => (
            <option key={td.id} value={td.id}>
              {td.name}
            </option>
          ))}
        </select>

        <button
          className="add-btn"
          onClick={handleAddDossier}
          disabled={!newDossier.typeDossierId}
        >
          Ajouter dossier
        </button>
      </div>
    </div>

  </div>

      {/* === Documents === */}
      <div className="documents-container">
      {/* === Titre === */}
      <h3 className="documents-title">
  <img src={documentationIcon} alt="Documents" className="documentation-icon" />
  Mes documents
</h3>

      {/* === Tableau documents === */}
      <table className="documents-table">
        <thead>
          <tr>
            {["Type", "Dossier", "Fichier", "Plateforme", "Emplacement import", "Actions"].map(
              (header) => (
                <th key={header}>{header}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const docType = documentTypes.find((dt) => dt.id === doc.type);
            const dossier = dossiers.find((d) => d.id === doc.dossierAdministratifId);
            const type = typeDossiers.find((t) => t.id === dossier?.typeDossierId);

            return (
              <tr key={doc.id}>
                {editDocument?.id === doc.id ? (
                  <>
                    <td>
                      <select
                        value={editDocument.type}
                        onChange={(e) =>
                          setEditDocument((prev) => ({ ...prev, type: e.target.value }))
                        }
                      >
                        {documentTypes.map((dt) => (
                          <option key={dt.id} value={dt.id}>
                            {dt.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{doc.dossierAdministratifId}</td>
                    <td>
                      <input
                        type="text"
                        value={editDocument.filePath}
                        onChange={(e) =>
                          setEditDocument((prev) => ({ ...prev, filePath: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isAdmin ? editDocument.isOnPlatform : false}
                        disabled={!isAdmin}
                        onChange={(e) =>
                          setEditDocument((prev) => ({ ...prev, isOnPlatform: e.target.checked }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={isAdmin ? editDocument.importLocation : ""}
                        disabled={!isAdmin}
                        onChange={(e) =>
                          setEditDocument((prev) => ({ ...prev, importLocation: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <button onClick={handleUpdateDocument}>✔ Sauvegarder</button>
                      <button onClick={() => setEditDocument(null)}>✖ Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{docType?.name || doc.type}</td>
                    <td>{`${type?.name || "Type inconnu"} - ${doc.dossierAdministratifId}`}</td>
                    <td>
                      {doc.filePath ? (
                        <a
                          href={
                            doc.filePath.startsWith("http")
                              ? doc.filePath
                              : `http://localhost:5018/CitizenService/${doc.filePath}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={fileIcon} alt="file" />
                          {doc.filePath}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{doc.isOnPlatform ? "Oui" : "Non"}</td>
                    <td>{doc.importLocation || ""}</td>
                    <td>
                      <button onClick={() => handleEditDocument(doc)}>Modifier</button>
                      <button onClick={() => handleDeleteDocument(doc.id)}>Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* === Formulaire ajout document === */}
      <div className="add-document-form">
  <h4 className="add-document-title">
    <img
      src={fileIcon}
      alt="Ajouter"
      className="file-icon"
    />
    Ajouter un document
  </h4>

        <select
          value={newDocument.type}
          onChange={(e) => setNewDocument((prev) => ({ ...prev, type: e.target.value }))}
        >
          <option value="">Sélectionner type</option>
          {documentTypes.map((dt) => (
            <option key={dt.id} value={dt.id}>
              {dt.name}
            </option>
          ))}
        </select>

        <select
          value={newDocument.dossierAdministratifId}
          onChange={(e) =>
            setNewDocument((prev) => ({ ...prev, dossierAdministratifId: e.target.value }))
          }
        >
          <option value="">Sélectionner dossier</option>
          {dossiers.map((d) => {
            const type = typeDossiers.find((t) => t.id === d.typeDossierId);
            return (
              <option key={d.id} value={d.id}>
                {type?.name || "Type inconnu"} - {d.id}
              </option>
            );
          })}
        </select>

        <input
          type="text"
          placeholder="Chemin fichier"
          value={newDocument.filePath}
          onChange={(e) => setNewDocument((prev) => ({ ...prev, filePath: e.target.value }))}
        />

        <input
          type="text"
          placeholder="Emplacement import"
          value={isAdmin ? newDocument.importLocation : ""}
          disabled={!isAdmin}
          onChange={(e) => setNewDocument((prev) => ({ ...prev, importLocation: e.target.value }))}
        />

        <label>
          <input
            type="checkbox"
            checked={isAdmin ? newDocument.isOnPlatform : false}
            disabled={!isAdmin}
            onChange={(e) => setNewDocument((prev) => ({ ...prev, isOnPlatform: e.target.checked }))}
          />
          Sur plateforme
        </label>

        <button onClick={handleAddDocument}>Ajouter document</button>
      </div>
    </div>
    {/* === Rendezvous === */}
{activeSection === "rendezvous" && (
  <div className="panel">
    <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img src={calendarIcon} alt="Calendrier" style={{ width: "24px", height: "24px" }} />
      Mes rendez-vous
    </h3>

    {/* Formulaire création rendez-vous */}
    <div className="form-group">
      <select
        value={typeDossierId}
        onChange={(e) => setTypeDossierId(e.target.value)}
      >
        <option value="">Sélectionner type dossier</option>
        {typeDossiers.map((td) => (
          <option key={td.id} value={td.id}>{td.name}</option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />
      <button onClick={handleAddRendezvous}>Prendre rendez-vous</button>
    </div>

    {/* Vérification / annulation rendez-vous */}
    <div className="form-group" style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="Rendezvous ID"
        value={rendezvousId}
        onChange={(e) => setRendezvousId(e.target.value)}
      />
      <button onClick={handleGetRendezvous}>Voir</button>
      <button onClick={handleDeleteRendezvous}>Annuler</button>
    </div>

    {rdvMessage && <p>{rdvMessage}</p>}

    {/* Rendez-vous sélectionné */}
    {rendezvous && (
      <div className="panel-item">
        <p><strong>ID:</strong> {rendezvous.id}</p>
        <p><strong>Date:</strong> {new Date(rendezvous.appointmentDate).toLocaleString()}</p>
        <p>
          <strong>Type Dossier:</strong>{" "}
          {typeDossiers.find((td) => td.id === rendezvous.typeDossierId)?.name || rendezvous.typeDossierId}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {rendezvous.status === "en attente" ? "En attente" :
           rendezvous.status === "validé" ? <img src={checkIcon} alt="Validé" style={{ width: "18px", height: "18px" }} /> :
           rendezvous.status === "refusé" ? <img src={crossIcon} alt="Refusé" style={{ width: "18px", height: "18px" }} /> :
           rendezvous.status
          }
        </p>
      </div>
    )}

    {/* Liste de tous les rendez-vous */}
    <div className="panel-item" style={{ marginTop: "20px" }}>
      <h4>Mes rendez-vous précédents</h4>
      <table border="1" cellPadding="5" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type Dossier</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rendezvousList
            .filter((rdv) => rdv.userId === userId)
            .map((rdv) => (
              <tr key={rdv.id}>
                <td>{rdv.id}</td>
                <td>{new Date(rdv.appointmentDate).toLocaleString()}</td>
                <td>{typeDossiers.find((td) => td.id === rdv.typeDossierId)?.name || rdv.typeDossierId}</td>
                <td>
                  {rdv.status === "en attente" ? "En attente" :
                   rdv.status === "validé" ? <img src={checkIcon} alt="Validé" style={{ width: "18px", height: "18px" }} /> :
                   rdv.status === "refusé" ? <img src={crossIcon} alt="Refusé" style={{ width: "18px", height: "18px" }} /> :
                   rdv.status
                  }
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

     {/* 🔹 Notifications */}
<div className="notification-card">
  <h2 className="notification-title">Mes Notifications</h2>

  {notifications.filter(n => n.status !== "Accepted" && n.status !== "Refused").length === 0 ? (
    <p className="notification-empty">Aucune notification.</p>
  ) : (
    <ul className="notification-list">
      {notifications
        .filter(n => n.status !== "Accepted" && n.status !== "Refused")
        .map((n) => (
        <li key={n.id} className="notification-item">
          <div className="notification-content">
            <p className="notification-message">{n.message}</p>
            <p className="notification-date">
              {n.notificationDate ? new Date(n.notificationDate).toLocaleString() : ''}
            </p>
          </div>

          <button
            className="notification-delete-btn"
            onClick={() => handleDeleteNotification(n.id)}
            style={{ 
              background: '#e67e22', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              cursor: 'pointer' 
            }}
          >
            <img src={trashIcon} alt="Supprimer" style={{ width: '16px', marginRight: '4px' }} />
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  )}
</div>


    </div>
  );
};

export default CitizenPage;


