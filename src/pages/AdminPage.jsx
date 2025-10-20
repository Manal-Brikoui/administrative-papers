
import React, { useEffect, useState } from "react";
import keycloak from "../config/keycloak";
import "./admin.css";
import Sidebar from "../components/Sidebar";
import trashIcon from "../assets/trash-can-black-symbol.png";
import editIcon from "../assets/edit-text.png";
import categoryIcon from "../assets/category.png";
import addIcon from "../assets/plus.png";
import documentationIcon from "../assets/documentation.png";
import fileIcon from "../assets/file.png";
import folderIcon from "../assets/folder.png"; 
import calendarIcon from "../assets/schedule.png";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import {
  getTypeDossiers,
  addTypeDossier,
  updateTypeDossier,
  deleteTypeDossier,
} from "../services/typeDossierService";

import {
  getDossiers,
  updateDossier,
  deleteDossier
} from "../services/dossierAdministratifService";

import {
  getDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from "../services/documentService";

import {
  getDocumentTypes,
  addDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from "../services/documentTypeService";

import { getNotifications, deleteNotification } from "../services/notificationService";

import {
  getAllRendezvous,
  validateRendezvous,
  deleteRendezvous,
} from "../services/rendezvousService";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [typeDossiers, setTypeDossiers] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(true);


  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTypeDossierName, setNewTypeDossierName] = useState("");
  const [newDocumentType, setNewDocumentType] = useState({ name: "", categoryId: "", typeDossierId: "" });
  const [newDocumentDossierId, setNewDocumentDossierId] = useState("");
  const [newDocumentTypeNameTemp, setNewDocumentTypeNameTemp] = useState("");
  const [newDocumentFilePath, setNewDocumentFilePath] = useState("");
  const [newDocumentIsOnPlatform, setNewDocumentIsOnPlatform] = useState(true);
  const [newDocumentImportLocation, setNewDocumentImportLocation] = useState("");

  const [editingCategory, setEditingCategory] = useState({ id: null, name: "" });
  const [editingTypeDossier, setEditingTypeDossier] = useState({ id: null, name: "" });
  const [editingDocumentType, setEditingDocumentType] = useState({ id: null, name: "", categoryId: "", typeDossierId: "" });
  const [editingDocument, setEditingDocument] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [activeSection, setActiveSection] = useState("dashboard"); 




  const [editingDossier, setEditingDossier] = useState(null);


const fetchDocuments = async () => {
  try {
    const allDocs = await getDocuments(); // service backend
    setDocuments(allDocs); // stocke tous les documents
  } catch (err) {
    console.error("Erreur récupération documents :", err);
  }
};


useEffect(() => {
  fetchDocuments();
  fetchDossiers();
}, []);


const fetchDossiers = async () => {
  try {
    const data = await getDossiers(); 
    setDossiers(data);
  } catch (error) {
    console.error("Erreur récupération dossiers:", error);
  }
};






useEffect(() => {
  if (keycloak.authenticated) {
    fetchDossiers();
  }
}, [keycloak.authenticated]);
useEffect(() => {
  if (keycloak.authenticated) fetchDossiers();
}, [keycloak.authenticated]);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          allCategories,
          allTypeDossiers,
          allDocumentTypes,
          allDossiers,
          allDocuments,
          allNotifications,
          allRendezvous,
        ] = await Promise.all([
          getCategories(),
          getTypeDossiers(),
          getDocumentTypes(),
          getDossiers(),
          getDocuments(),
          getNotifications(),
          getAllRendezvous(),
        ]);

        setCategories(allCategories);
        setTypeDossiers(allTypeDossiers);
        setDocumentTypes(allDocumentTypes);
        setDossiers(allDossiers);
        setDocuments(allDocuments);
        setNotifications(allNotifications);
        setRendezvous(allRendezvous);
      } catch (err) {
        console.error("Erreur chargement données admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return alert("Nom requis !");
    try {
      const category = await addCategory({ name: newCategoryName });
      setCategories((prev) => [...prev, category]);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategory.name.trim()) return alert("Nom requis !");
    try {
      await updateCategory(id, { id, name: editingCategory.name });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editingCategory.name } : c))
      );
      setEditingCategory({ id: null, name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTypeDossier = async () => {
    if (!newTypeDossierName.trim()) return alert("Nom requis !");
    try {
      const td = await addTypeDossier({ name: newTypeDossierName });
      setTypeDossiers((prev) => [...prev, td]);
      setNewTypeDossierName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTypeDossier = async (id) => {
    if (!editingTypeDossier.name.trim()) return alert("Nom requis !");
    try {
      await updateTypeDossier(id, { id, name: editingTypeDossier.name });
      setTypeDossiers((prev) =>
        prev.map((td) => (td.id === id ? { ...td, name: editingTypeDossier.name } : td))
      );
      setEditingTypeDossier({ id: null, name: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTypeDossier = async (id) => {
    if (!window.confirm("Supprimer ce type de dossier ?")) return;
    try {
      await deleteTypeDossier(id);
      setTypeDossiers((prev) => prev.filter((td) => td.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDocumentType = async () => {
    if (!newDocumentType.name.trim() || !newDocumentType.categoryId || !newDocumentType.typeDossierId)
      return alert("Nom, catégorie et type de dossier requis !");
    try {
      const dt = await addDocumentType(newDocumentType);
      setDocumentTypes((prev) => [...prev, dt]);
      setNewDocumentType({ name: "", categoryId: "", typeDossierId: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDocumentType = async (id) => {
    if (!editingDocumentType.name.trim() || !editingDocumentType.categoryId || !editingDocumentType.typeDossierId)
      return alert("Nom, catégorie et type de dossier requis !");
    try {
      await updateDocumentType(id, editingDocumentType);
      setDocumentTypes((prev) =>
        prev.map((dt) => (dt.id === id ? { ...editingDocumentType } : dt))
      );
      setEditingDocumentType({ id: null, name: "", categoryId: "", typeDossierId: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocumentType = async (id) => {
    if (!window.confirm("Supprimer ce type de document ?")) return;
    try {
      await deleteDocumentType(id);
      setDocumentTypes((prev) => prev.filter((dt) => dt.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Document ---
  const handleAddDocument = async () => {
    if (!newDocumentTypeNameTemp || !newDocumentDossierId)
      return alert("Type et Dossier sont requis !");
    try {
      const doc = await addDocument({
        type: newDocumentTypeNameTemp,
        dossierAdministratifId: newDocumentDossierId,
        filePath: newDocumentFilePath || "",
        isOnPlatform: newDocumentIsOnPlatform,
        importLocation: newDocumentImportLocation || "",
        uploadDate: new Date().toISOString(),
        userId: keycloak.tokenParsed?.sub || "",
      });
      setDocuments((prev) => [...prev, doc]);

      setNewDocumentTypeNameTemp("");
      setNewDocumentDossierId("");
      setNewDocumentFilePath("");
      setNewDocumentIsOnPlatform(true);
      setNewDocumentImportLocation("");
    } catch (err) {
      console.error("Erreur ajout document :", err.response?.data || err.message);
    }
  };

  const handleEditDocument = (doc) => {
    setEditingDocument(doc);
  };

    const handleUpdateDocument = async (id) => {
    if (!editingDocument.type || !editingDocument.dossierAdministratifId)
      return alert("Type et Dossier requis !");
    try {
      const updatedDoc = await updateDocument(id, editingDocument);
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? updatedDoc : d))
      );
      setEditingDocument({
        id: null,
        type: "",
        dossierAdministratifId: "",
        filePath: "",
        isOnPlatform: false,
        importLocation: "",
        uploadDate: null,
      });
    } catch (err) {
      console.error("Erreur mise à jour document :", err.response?.data || err.message);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Supprimer ce document ?")) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  const handleEditDossier = (dossier) => {
  if (!dossier) return;
  setEditingDossier({
    ...dossier,
    validationDate: dossier.validationDate ? dossier.validationDate.split("T")[0] : "",
  });
};
const handleUpdateDossier = async (id) => {
  try {
    if (!editingDossier) return;

    const updatedDossier = {
      ...editingDossier,
      id: id,
      typeDossierId: editingDossier.typeDossierId || editingDossier.typeDossier?.id,
      validationDate: editingDossier.validationDate
        ? new Date(editingDossier.validationDate).toISOString() // <-- conversion en UTC
        : null,
      isCompleted: editingDossier.isCompleted || false,
    };

    console.log("Données envoyées:", updatedDossier);

    await updateDossier(id, updatedDossier); // fonction axios PUT
    fetchDossiers();
    setEditingDossier(null);
  } catch (error) {
    console.error("Erreur mise à jour dossier: ", error);
    alert("Erreur lors de la mise à jour du dossier.");
  }
};
  const handleDeleteDossier = async (id) => {
  if (!id || !window.confirm("Supprimer ce dossier ?")) return;
  try {
    await deleteDossier(id);
    setDossiers((prev) => prev.filter((d) => d.id !== id));
  } catch (err) {
    console.error(err);
  }
};

  const handleDeleteNotification = async (id) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidateRendezvous = async (id, approved) => {
    try {
      await validateRendezvous(id, approved ? "validé" : "refusé");
      setRendezvous((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: approved ? "validé" : "refusé" } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRendezvous = async (id) => {
    if (!window.confirm("Supprimer ce rendez-vous ?")) return;
    try {
      await deleteRendezvous(id);
      setRendezvous((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <div>Chargement...</div>;
  return (
  <div className={`admin-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
    {/* Sidebar */}
    <Sidebar
      isOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      setActiveSection={setActiveSection}
      notifications={notifications}
      rendezvous={rendezvous}
    />

    <div className="admin-main">
      <h2>Espace Administratif</h2>

    
      <div className="horizontal-sections">
        
        {/* Categories Section */}
        <div className="section card category-section">
          <h3>
            <img
              src={categoryIcon}
              alt="Catégories"
              style={{ width: "25px", marginRight: "8px" }}
            />
            Catégories
          </h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nouvelle catégorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button className="btn-add" onClick={handleAddCategory}>
              <img src={addIcon} alt="Ajouter" />
            </button>
          </div>
          <ul className="list-items">
            {categories.map((c) => (
              <li key={c.id} className="list-item">
                {editingCategory.id === c.id ? (
                  <>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                    />
                    <button className="btn-save" onClick={() => handleUpdateCategory(c.id)}>
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingCategory({ id: null, name: "" })}>
                    </button>
                  </>
                ) : (
                  <>
                    <span>{c.name}</span>
                    <div className="button-group">
                      <button
                        className="btn-edit"
                        onClick={() => setEditingCategory({ id: c.id, name: c.name })}
                      >
                        <img src={editIcon} alt="Modifier" />
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteCategory(c.id)}>
                        <img src={trashIcon} alt="Supprimer" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

     
        <div className="section card type-dossier-section">
          <h3>
            Types de Dossier
          </h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nouveau type"
              value={newTypeDossierName}
              onChange={(e) => setNewTypeDossierName(e.target.value)}
            />
            <button className="btn-add" onClick={handleAddTypeDossier}>
              <img src={addIcon} alt="Ajouter" />
            </button>
          </div>
          <ul className="list-items">
            {typeDossiers.map((td) => (
              <li key={td.id} className="list-item">
                {editingTypeDossier.id === td.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTypeDossier.name}
                      onChange={(e) =>
                        setEditingTypeDossier({ ...editingTypeDossier, name: e.target.value })
                      }
                    />
                    <button className="btn-save" onClick={() => handleUpdateTypeDossier(td.id)}>
                      
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingTypeDossier({ id: null, name: "" })}>
                      
                    </button>
                  </>
                ) : (
                  <>
                    <span>{td.name}</span>
                    <div className="button-group">
                      <button
                        className="btn-edit"
                        onClick={() => setEditingTypeDossier({ id: td.id, name: td.name })}
                      >
                        <img src={editIcon} alt="Modifier" />
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteTypeDossier(td.id)}>
                        <img src={trashIcon} alt="Supprimer" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>

<div className="document-type-section">
  <h3>
    <img src={documentationIcon} alt="Types de Documents" className="icon" />
    Types de Documents
  </h3>

  {/* Formulaire d’ajout */}
  <div className="form-group">
    <input
      type="text"
      placeholder="Nom type de document"
      value={newDocumentType.name}
      onChange={(e) =>
        setNewDocumentType({ ...newDocumentType, name: e.target.value })
      }
    />

    <select
      value={newDocumentType.categoryId}
      onChange={(e) =>
        setNewDocumentType({ ...newDocumentType, categoryId: e.target.value })
      }
    >
      <option value="">Sélectionner catégorie</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>

    <select
      value={newDocumentType.typeDossierId}
      onChange={(e) =>
        setNewDocumentType({
          ...newDocumentType,
          typeDossierId: e.target.value,
        })
      }
    >
      <option value="">Sélectionner type de dossier</option>
      {typeDossiers.map((td) => (
        <option key={td.id} value={td.id}>
          {td.name}
        </option>
      ))}
    </select>

    <button className="btn-add" onClick={handleAddDocumentType}>
      <img src={fileIcon} alt="Ajouter" className="icon-small" />
      Ajouter
    </button>
  </div>


  <ul className="document-type-list">
    {documentTypes.map((dt) => (
      <li key={dt.id}>
        {editingDocumentType.id === dt.id ? (
          <>
            <input
              type="text"
              value={editingDocumentType.name}
              onChange={(e) =>
                setEditingDocumentType({
                  ...editingDocumentType,
                  name: e.target.value,
                })
              }
            />
            <select
              value={editingDocumentType.categoryId}
              onChange={(e) =>
                setEditingDocumentType({
                  ...editingDocumentType,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">Sélectionner catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={editingDocumentType.typeDossierId}
              onChange={(e) =>
                setEditingDocumentType({
                  ...editingDocumentType,
                  typeDossierId: e.target.value,
                })
              }
            >
              <option value="">Sélectionner type de dossier</option>
              {typeDossiers.map((td) => (
                <option key={td.id} value={td.id}>
                  {td.name}
                </option>
              ))}
            </select>
            <div>
              <button onClick={() => handleUpdateDocumentType(dt.id)}>
                Sauvegarder
              </button>
              <button
                onClick={() =>
                  setEditingDocumentType({
                    id: null,
                    name: "",
                    categoryId: "",
                    typeDossierId: "",
                  })
                }
              >
                Annuler
              </button>
            </div>
          </>
        ) : (
          <>
            <span>{dt.name}</span>
            <div>
              <button
                onClick={() =>
                  setEditingDocumentType({
                    id: dt.id,
                    name: dt.name,
                    categoryId: dt.categoryId,
                    typeDossierId: dt.typeDossierId,
                  })
                }
              >
                Modifier
              </button>
              <button onClick={() => handleDeleteDocumentType(dt.id)}>
                Supprimer
              </button>
            </div>
          </>
        )}
      </li>
    ))}
  </ul>
</div>

<div className="documents-section" style={{ marginTop: "20px" }}>
  <h3>
    <img src={fileIcon} alt="Ajouter un document" className="icon" />
    Ajouter un document
  </h3>

  <div className="form-group">
    <select
      value={newDocumentTypeNameTemp}
      onChange={(e) => setNewDocumentTypeNameTemp(e.target.value)}
    >
      <option value="">Sélectionner type de document</option>
      {documentTypes?.map((dt) => (
        <option key={dt.id} value={dt.id}>{dt.name}</option>
      ))}
    </select>

    <select
      value={newDocumentDossierId}
      onChange={(e) => setNewDocumentDossierId(e.target.value)}
    >
      <option value="">Sélectionner un dossier</option>
      {dossiers?.map((d) => (
        <option key={d.id} value={d.id}>
          {d.title || d.name} (ID: {d.id})
        </option>
      ))}
    </select>

    <input
      type="text"
      placeholder="Chemin du fichier"
      value={newDocumentFilePath}
      onChange={(e) => setNewDocumentFilePath(e.target.value)}
    />

    <input
      type="text"
      placeholder="Emplacement import (si externe)"
      value={newDocumentImportLocation}
      onChange={(e) => setNewDocumentImportLocation(e.target.value)}
    />

    <label style={{ marginLeft: "10px" }}>
      Disponible sur plateforme ?
      <input
        type="checkbox"
        checked={newDocumentIsOnPlatform}
        onChange={(e) => setNewDocumentIsOnPlatform(e.target.checked)}
      />
    </label>

    <button className="btn-add" onClick={handleAddDocument}>
      Ajouter Document
    </button>
  </div>

  <h4>Liste des documents</h4>
  <table className="documents-table">
    <thead>
      <tr>
        <th>Type de document</th>
        <th>Dossier (ID)</th>
        <th>Fichier</th>
        <th>Date d'upload</th>
        <th>Sur plateforme</th>
        <th>Emplacement import</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {documents?.map((doc, index) => {
        const dossier = dossiers?.find((d) => d.id === doc.dossierAdministratifId);
        return (
          <tr key={doc.id || index}>
            {editingDocument?.id === doc.id ? (
              <>
                <td>
                  <select
                    value={editingDocument.type || ""}
                    onChange={(e) =>
                      setEditingDocument({ ...editingDocument, type: e.target.value })
                    }
                  >
                    <option value="">Sélectionner type de document</option>
                    {documentTypes?.map((dt) => (
                      <option key={dt.id} value={dt.id}>{dt.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={editingDocument.dossierAdministratifId || ""}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        dossierAdministratifId: e.target.value,
                      })
                    }
                  >
                    <option value="">Sélectionner un dossier</option>
                    {dossiers?.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title || d.name} (ID: {d.id})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={editingDocument.filePath || ""}
                    onChange={(e) =>
                      setEditingDocument({ ...editingDocument, filePath: e.target.value })
                    }
                  />
                </td>
                <td>
                  {editingDocument.uploadDate
                    ? new Date(editingDocument.uploadDate).toLocaleString()
                    : ""}
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editingDocument.isOnPlatform || false}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        isOnPlatform: e.target.checked,
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingDocument.importLocation || ""}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        importLocation: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <div className="button-group">
                    <button className="btn-orange" onClick={() => handleUpdateDocument(doc.id)}>Sauvegarder</button>
                    <button className="btn-orange" onClick={() =>
                      setEditingDocument({
                        id: null,
                        type: "",
                        dossierAdministratifId: "",
                        filePath: "",
                        isOnPlatform: false,
                        importLocation: "",
                        uploadDate: null,
                      })
                    }>
                      Annuler
                    </button>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td>{documentTypes?.find((dt) => dt.id === doc.type)?.name || doc.type}</td>
                <td>
                  {dossier ? dossier.title || dossier.name : doc.dossierAdministratifId}{" "}
                  (ID: {doc.dossierAdministratifId})
                </td>
                <td>
                  {doc.filePath ? (
                    <a
                      href={
                        doc.filePath.startsWith("http")
                          ? doc.filePath
                          : `http://localhost:5018/api/CitizenService/${doc.filePath}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {doc.filePath}
                    </a>
                  ) : "—"}
                </td>
                <td>{doc.uploadDate ? new Date(doc.uploadDate).toLocaleString() : ""}</td>
                <td>{doc.isOnPlatform ? "Oui" : "Non"}</td>
                <td>{doc.importLocation}</td>
                <td>
                  <div className="button-group">
                    <button className="btn-orange" onClick={() => handleEditDocument(doc)}>
                      <img src={editIcon} alt="Modifier" style={{ width: "16px", marginRight: "5px" }} />
                      Modifier
                    </button>
                    <button className="btn-orange" onClick={() => handleDeleteDocument(doc.id)}>
                      <img src={trashIcon} alt="Supprimer" style={{ width: "16px", marginRight: "5px" }} />
                      Supprimer
                    </button>
                  </div>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

<div className="dossiers-section" style={{ marginTop: "20px", width: "100%" }}>
  <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0f0601" }}>
    <img src={folderIcon} alt="Dossiers" style={{ width: "24px", height: "24px" }} />
    Dossiers Administratifs
  </h3>

  <table
    className="dossiers-table"
    style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
  >
    <thead>
      <tr style={{ backgroundColor: "#fff3e0", color: "#0f0601" }}>
        <th>ID</th>
        <th>Type</th>
        <th>Status</th>
        <th>Soumission</th>
        <th>Validation</th>
        <th>Complété</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {dossiers?.map((d) => {
        const typeDossier = typeDossiers?.find(td => td.id === d.typeDossierId);
        return (
          <tr key={d.id} style={{ borderBottom: "1px solid #ccc" }}>
            {editingDossier?.id === d.id ? (
              <>
                <td>{d.id}</td>
                <td>{typeDossier?.name || d.typeDossierId}</td>
                <td>
                  <select
                    value={editingDossier.status || ""}
                    onChange={(e) =>
                      setEditingDossier({ ...editingDossier, status: e.target.value })
                    }
                  >
                    <option value="En cours">En cours</option>
                    <option value="Validé">Validé</option>
                    <option value="Rejeté">Rejeté</option>
                  </select>
                </td>
                <td>{d.submissionDate ? new Date(d.submissionDate).toLocaleDateString() : "N/A"}</td>
                <td>
                  <input
                    type="date"
                    value={editingDossier.validationDate || ""}
                    onChange={(e) =>
                      setEditingDossier({ ...editingDossier, validationDate: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editingDossier.isCompleted || false}
                    onChange={(e) =>
                      setEditingDossier({ ...editingDossier, isCompleted: e.target.checked })
                    }
                  />
                </td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <button className="btn-edit" onClick={() => handleUpdateDossier(d.id)}>
                    Sauvegarder
                  </button>
                  <button className="btn-delete" onClick={() => setEditingDossier(null)}>
                    Annuler
                  </button>
                </td>
              </>
            ) : (
              <>
                <td>{d.id}</td>
                <td>{typeDossier?.name || d.typeDossierId}</td>
                <td>{d.status || "N/A"}</td>
                <td>{d.submissionDate ? new Date(d.submissionDate).toLocaleDateString() : "N/A"}</td>
                <td>{d.validationDate ? new Date(d.validationDate).toLocaleDateString() : "N/A"}</td>
                <td>{d.isCompleted ? "Oui" : "Non"}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <button className="btn-edit" onClick={() => handleEditDossier(d)}>
                    <img src={editIcon} alt="Modifier" style={{ width: "16px", marginRight: "5px" }} />
                    Modifier
                  </button>
                  <button className="btn-delete" onClick={() => handleDeleteDossier(d.id)}>
                    <img src={trashIcon} alt="Supprimer" style={{ width: "16px", marginRight: "5px" }} />
                    Supprimer
                  </button>
                </td>
              </>
            )}
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


{activeSection === "notifications" && (
  <div className="notifications-section" style={{ marginTop: '20px' }}>
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#0f0601",
        marginBottom: "15px"
      }}
    >
      Notifications
    </h3>

    {notifications.length === 0 ? (
      <p>Aucune notification pour le moment.</p>
    ) : (
      <ul
        className="notifications-list"
        style={{ listStyleType: 'none', padding: 0, margin: 0 }}
      >
        {notifications.map((n) => (
          <li
            key={n.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: '1px solid #ddd'
            }}
          >
           
            <span>
              {"Un citoyen a pris un rendez-vous. Veuillez vérifier."}
            </span>

            <button
              className="btn-delete"
              onClick={() => handleDeleteNotification(n.id)}
              style={{
                background: 'orange',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

{activeSection === "rendezvous" && (
  <div className="rendezvous-section">
    <h3 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#0f0601" }}>
      <img
        src={calendarIcon}
        alt="Rendez-vous"
        style={{ width: "24px", height: "24px" }}
      />
      Rendez-vous
    </h3>

    <table className="rendezvous-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Type Dossier</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rendezvous.map((r) => (
          <tr key={r.id}>
            <td>{r.userId}</td>
            <td>{r.typeDossierId}</td>
            <td>{new Date(r.appointmentDate).toLocaleDateString()}</td>
            <td>{r.status}</td>
            <td style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {r.status === "en attente" && (
                <>
                  <button
                    className="btn-validate"
                    onClick={() => handleValidateRendezvous(r.id, true)}
                  >
                    Valider
                  </button>
                  <button
                    className="btn-refuse"
                    onClick={() => handleValidateRendezvous(r.id, false)}
                  >
                    Refuser
                  </button>
                </>
              )}
              <button
                className="btn-delete"
                onClick={() => handleDeleteRendezvous(r.id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div> 
  </div> 
);
};

export default AdminPage;




