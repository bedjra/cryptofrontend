import React, { useState, useEffect } from "react";
import "./Parametre.css";

const apiUrl = "http://127.0.0.1:5000"; // Remplace avec ton URL d'API

const Parametre = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/user`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Erreur de chargement", error));
  }, []);

  return (
    <div className="parametre-container">
      <h2>Profil de l'utilisateur</h2>

      {user ? (
        <div className="profile-card">
          {/* Avatar Centré */}
          <img src={user.avatar || "/profil.png"} alt="Avatar" className="avatar" />

          {/* Nom */}
          <h3 className="user-name">{user.nom}</h3>

          {/* Email & Téléphone */}
          <div className="contact-info">
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Téléphone :</strong> {user.phone || "Non renseigné"}</p>
          </div>

          {/* Changer Mot de Passe & Déconnexion */}
          <div className="settings-actions">
            <button className="change-password">Changer le mot de passe</button>
            <button className="logout-button">Se déconnecter</button>
          </div>
        </div>
      ) : (
        <p>Chargement des informations...</p>
      )}
    </div>
  );
};

export default Parametre;
