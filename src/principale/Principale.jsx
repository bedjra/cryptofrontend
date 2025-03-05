import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom'; // Import NavLink
import { FaTachometerAlt, FaExchangeAlt, FaTruck, FaUsers, FaHistory, FaCalculator, FaSignOutAlt } from "react-icons/fa";
import "./Principale.css";

const Principale = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="debut">
      <div className="content">
        <header className="header-container">
          <img className='inge' src="/menu.png" alt="Profile" />
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
            &nbsp;
            <img src="/profil.png" alt="Profile" />
          </div>
        </header>
      </div>

      <div className="wrapper">
        <nav>
          <div className={`global ${isNavOpen ? "open" : ""}`}>
            <div className="sidebar">
              <ul className="nav-links">
                <li>
                  <NavLink to="accueil" activeClassName="active">
                    <FaTachometerAlt className="icon" />
                    <span className="links_name">Accueil</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="transactions" activeClassName="active">
                    <FaExchangeAlt className="icon" />
                    <span className="links_name">Transactions</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="calculs" activeClassName="active">
                    <FaCalculator className="icon" />
                    <span className="links_name">Calculs</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="historique" activeClassName="active">
                    <FaHistory className="icon" />
                    <span className="links_name">Historique</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="fournisseurs" activeClassName="active">
                    <FaTruck className="icon" />
                    <span className="links_name">Fournisseurs</span>
                  </NavLink>
                </li>
                {/* 
                <li>
                  <NavLink to="beneficiaires" activeClassName="active">
                    <FaUsers className="icon" />
                    <span className="links_name">Bénéficiaires</span>
                  </NavLink>
                </li>
                */}

                <li className="log_out">
                  <NavLink to="/" activeClassName="active">
                    <FaSignOutAlt className="icon" />
                    <span className="links_name">Déconnexion</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="content-area">
          <div className="routage">
            {/* L'Outlet ici charge le contenu de la route sélectionnée */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Principale;
