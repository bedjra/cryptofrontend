import React, { useState, useEffect } from "react";
import "./Parametre.css";
import { FaLock, FaSignOutAlt } from "react-icons/fa";

const apiUrl = "http://127.0.0.1:5000"; // Remplace avec ton URL d'API

const Parametre = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetch(`${apiUrl}/user`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.error("Erreur de chargement", error));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Changement de mot de passe :", formData);
        setShowModal(false);
    };

    return (
        <div className="parametre-container">
            <h2>Profil de l'utilisateur</h2>
            <br />
            {user ? (
                <>
                    {/* Bloc 1 : Avatar & Nom */}
                    <div className="profile-header">
                        <img src={user.avatar || "/profil.png"} alt="Avatar" className="avatar" />
                        <h3 className="user-name">{user.nom}</h3>
                    </div>

                    {/* Bloc 2 : Email & Téléphone */}
                    <div className="contact-info">
                        <p><strong>Email :</strong> {user.email}</p>
                        <br />
                        <p><strong>Téléphone :</strong> {user.phone || "Non renseigné"}</p>
                    </div>

                    {/* Bloc 3 : Changer mot de passe & Déconnexion */}
                    <div className="settings-actions">
                        <button className="change-password" onClick={() => setShowModal(true)}>
                            <FaLock className="icon" /> Changer le mot de passe
                        </button>
                        <button className="logout-button">
                            <FaSignOutAlt className="icon" /> Se déconnecter
                        </button>
                    </div>
                </>
            ) : (
                <p>Chargement des informations...</p>
            )}

            {/* Modal pour le changement de mot de passe */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Changer le mot de passe</h3>
                        <div className="modal-content">
                            <label>Ancien mot de passe</label>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    placeholder="Entrez votre ancien mot de passe"
                                />
                                <FaLock className="input-icon" />
                            </div>

                            <label>Nouveau mot de passe</label>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Entrez votre nouveau mot de passe"
                                />
                                <FaLock className="input-icon" />
                            </div>

                            <label>Confirmer le mot de passe</label>
                            <div className="input-container">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirmez votre nouveau mot de passe"
                                />
                                <FaLock className="input-icon" />
                            </div>

                            <div className="modal-buttons">
                                <button className="validate-button" onClick={handleSubmit}>Valider</button>
                                <button className="close-button" onClick={() => setShowModal(false)}>Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parametre;
