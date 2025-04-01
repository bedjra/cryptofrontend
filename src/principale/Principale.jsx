import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaExchangeAlt, FaTruck, FaUsers, FaHistory, FaCalculator, FaSignOutAlt } from "react-icons/fa";
import "./Principale.css";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa"; // Icônes de recherche et profil

const Principale = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // Le menu est fermé par défaut
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  // Fonction pour basculer l'état du menu
  const toggleNav = () => {
    console.log('toggleNav called');
    setIsNavOpen(!isNavOpen);
  };

  // Ferme le menu si on clique sur un lien (uniquement sur mobile)
  const closeNav = () => {
    console.log('closeNav called');
    if (isMobile) setIsNavOpen(false);
  };

  // Met à jour l'état de isMobile si la taille de l'écran change
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // Force la fermeture du menu si on charge sur mobile
    console.log('isMobile:', isMobile);
    if (isMobile) {
      console.log('Menu should be closed on mobile');
      setIsNavOpen(false);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]); // On ajoute [isMobile] comme dépendance pour s'assurer que l'effet se met à jour lorsque la taille de l'écran change

  console.log('isNavOpen:', isNavOpen); // Vérifier la valeur actuelle de isNavOpen


  // Fonction pour rediriger vers la page Parametre
  const goToParametre = () => {
    navigate("/profil");
  };

  return (
    <div className="debut">

      <div className="wrappe">
        {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}

        <nav className={`sideba ${isNavOpen ? "open" : ""}`}>

          <div className="dots">
            <img src="/logo.png" alt="Profile" />

            <h3>Analyse</h3>
          </div>
          <hr />
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
                <span className="links_name">Transctions</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="fournisseurs" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaTruck className="icon" />
                <span className="links_name">Fournisseurs</span>
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

            <li className="log_out">
              <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeNav}>
                <FaSignOutAlt className="icon" />
                <span className="links_name">Déconnexion</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="content-area">
          <div className="headerNew">
            <img className='inge' src="/menu.png" alt="Menu" onClick={toggleNav} />

            <div className={`search-container ${searchActive ? "active" : ""}`}>
              {!searchActive ? (
                <div className="search-placeholder" onClick={() => setSearchActive(true)}>
                  <FaSearch className="search-icon" />
                  &nbsp;&nbsp; <span className="search-text">Recherche</span>
                </div>
              ) : (
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Rechercher..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => setSearchActive(false)} // Cache l'input si on clique ailleurs
                  autoFocus
                />
              )}

            </div>
            <div className="profile-icon">
              <img src="/profil.png" alt="Profile" onClick={goToParametre} style={{ cursor: "pointer" }} />
            </div>
          </div>

          <div className="routage">

            <Outlet />

          </div>

        </div>
      </div>


    </div>


  );
};

export default Principale;
