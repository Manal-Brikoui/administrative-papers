// components/Sidebar.jsx
import React from "react";
import "../pages/admin.css";

import optionsIcon from "../assets/options-lines.png";
import scheduleIcon from "../assets/schedule.png";
import notificationIcon from "../assets/notification.png";

const Sidebar = ({ isOpen, toggleSidebar, setActiveSection, notifications, rendezvous }) => {
  // Calculer le nombre de notifications et rendez-vous en attente
  const pendingNotifications = notifications?.length || 0;
  const pendingRendezvous = rendezvous?.filter(r => r.status === "en attente").length || 0;

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Bouton menu */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <img src={optionsIcon} alt="Menu" />
      </button>

      {/* Contenu menu */}
      <div className="sidebar-content">
        <div
          className="sidebar-item"
          onClick={() => setActiveSection("rendezvous")}
        >
          <img src={scheduleIcon} alt="Rendez-vous" />
          {isOpen && <span>Rendez-vous</span>}
          {pendingRendezvous > 0 && <span className="badge">{pendingRendezvous}</span>}
        </div>
        <div
          className="sidebar-item"
          onClick={() => setActiveSection("notifications")}
        >
          <img src={notificationIcon} alt="Notifications" />
          {isOpen && <span>Notifications</span>}
          {pendingNotifications > 0 && <span className="badge">{pendingNotifications}</span>}
        </div>
        <div
          className="sidebar-item"
          onClick={() => setActiveSection("dashboard")}
        >
          {isOpen && <span>Tableau de bord</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
