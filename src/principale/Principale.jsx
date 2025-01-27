import React, { useState } from "react";
import "./Principale.css";

const Principale = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [avatar] = useState(null); // Replace with actual avatar fetching logic
  const [nom] = useState("Admin"); // Replace with actual name fetching logic

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const goToProfile = () => {
    console.log("Navigating to profile...");
  };

  return (
    <div className="debut">
      <header className="content">
        <div className="header-container">
          <img
            src="/assets/Images/menu.png"
            alt="Menu"
            className="menu-icon"
            height="50px"
            onClick={toggleNav}
          />
          <div className="dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <p>
              Admin <span>Logo</span>
            </p>
          </div>
          <div className="profile-details" onClick={goToProfile}>
            <span className="admin_name">
              Welcome <br />
              {nom}
            </span>
            &nbsp;
            {avatar && (
              <img
                src={`data:image/png;base64,${avatar}`}
                alt="Avatar"
                className="profile-avatar"
              />
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`nav ${isNavOpen ? "open" : ""}`}>
        <div className="global">
          <ul className="nav-links">
            <li>
              <a href="/dashboard" className="nav-link">
                <img
                  src="/assets/Images/dashboard.png"
                  alt="Dashboard Icon"
                  height="25px"
                  className="icon"
                />
                <span className="links_name">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/formulaire" className="nav-link">
                <img
                  src="/assets/Images/exam.png"
                  alt="Formulaire Icon"
                  height="30px"
                  className="icon"
                />
                <span className="links_name">Formulaire</span>
              </a>
            </li>
            <li className="log_out">
              <a href="/" className="nav-link">
                <i className="fas fa-sign-out-alt"></i>
                <span className="links_name">Déconnexion</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content-area">
        <div className="routage">
          <p>Content goes here</p>
        </div>
      </div>
    </div>
  );
};

export default Principale;
