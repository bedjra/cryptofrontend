import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaTruck, FaUsers, FaHistory, FaCalculator, FaSignOutAlt } from "react-icons/fa";
import "./Principale.css";

const Principale = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fonction pour basculer l'état du menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Ferme le menu si on clique sur un lien (uniquement sur mobile)
  const closeNav = () => {
    if (isMobile) setIsNavOpen(false);
  };

  // Met à jour l'état de isMobile si la taille de l'écran change
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="debut">
      <div className="content">
        <header className="header-container">
          {/* Icône cliquable pour ouvrir/fermer le menu */}
          <img className='inge' src="/menu.png" alt="Menu" onClick={toggleNav} />
          
          <div className="dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <h6>CRYPTO</h6>
          </div>
          <div className="profile-details">
            <span className="admin_name">
              Welcome <br /> Admin
            </span>
            <img src="/profil.png" alt="Profile" />
          </div>
        </header>
      </div>

      <div className="wrapper">
        <nav className={`sidebar ${isNavOpen ? "open" : ""}`}>
          <ul className="nav-links">
            <li>
              <NavLink to="accueil" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaTachometerAlt className="icon" />
                <span className="links_name">Accueil</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="transactions" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaExchangeAlt className="icon" />
                <span className="links_name">Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="calculs" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaCalculator className="icon" />
                <span className="links_name">Calculs</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="historique" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaHistory className="icon" />
                <span className="links_name">Historique</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="fournisseurs" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaTruck className="icon" />
                <span className="links_name">Fournisseurs</span>
              </NavLink>
            </li>
            <li className="log_out">
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaSignOutAlt className="icon" />
                <span className="links_name">Déconnexion</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="content-area">
          <div className="routage">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Principale;
