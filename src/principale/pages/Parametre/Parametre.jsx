import React, { useState, useEffect } from "react";
import "./Parametre.css";

const apiUrl = "http://127.0.0.1:5000"; // Remplace avec ton URL d'API

const Parametre = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simule une requête API pour récupérer les infos de l'utilisateur
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
          <img src={user.avatar || "/profil.png"} alt="Avatar" className="avatar" />
          <div className="user-info">
            <p><strong>Nom :</strong> {user.nom}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Rôle :</strong> {user.role}</p>
            <p><strong>Date d'inscription :</strong> {new Date(user.dateInscription).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <p>Chargement des informations...</p>
      )}
    </div>
  );
};

export default Parametre;
