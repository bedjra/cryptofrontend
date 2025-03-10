import React, { useState, useEffect } from "react";
import "./Parametre.css";
import { useNavigate } from "react-router-dom";
import { FaLock, FaSignOutAlt, FaEye, FaEyeSlash } from "react-icons/fa";

const apiUrl = "http://127.0.0.1:5000";

const Parametre = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        console.log("Vérification userId:", userId);
        if (userId) {
            fetch(`${apiUrl}/user/connecte`, {
                method: "GET",
                credentials: "include",
            })
                .then((response) => {
                    console.log("Réponse API /user/connecte:", response);
                    if (!response.ok) {
                        throw new Error("Erreur de chargement");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Données utilisateur:", data);
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Erreur de chargement", error);
                    alert("Impossible de récupérer les informations utilisateur.");
                });
        }
    }, [userId]);

    const handleLogout = () => {
        console.log("Déconnexion...");
        localStorage.clear();
        navigate("/");
    };

    const handleChange = (e) => {
        console.log(`Modification champ ${e.target.name}:`, e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log("Tentative de changement de mot de passe...");

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        try {
            console.log("Envoi des données:", formData);
            const response = await fetch(`${apiUrl}/change`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

            console.log("Réponse API changement mdp:", response);

            if (!response.ok) {
                throw new Error("Erreur lors du changement de mot de passe");
            }
            alert("Mot de passe changé avec succès");
            setShowModal(false);
        } catch (error) {
            console.error("Erreur:", error);
            alert("Échec du changement de mot de passe");
        }
    };

    return (
        <div className="parametre-container">
            <h2>Profil de l'utilisateur</h2>
            <br />
            <div className="profile-header">
                <img src="/profil.png" alt="Avatar" className="avatar" />
                <h3 className="user-name">{user ? user.Nom : "Utilisateur inconnu"}</h3>
            </div>
            <div className="contact-info">
                <p><strong>Email :</strong> {user ? user.Email : "Non disponible"}</p>
                <br />
                <p><strong>Rôle :</strong> {user ? user.Rôle : "Non disponible"}</p>
            </div>
            <div className="settings-actions">
                <button className="change-password" onClick={() => setShowModal(true)}>
                    <FaLock className="icon" /> Changer le mot de passe
                </button>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" /> Se déconnecter
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Changer le mot de passe</h3>
                        <div className="modal-content">
                            <div className="input-container">
                                <FaLock className="lock-icon" />
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    placeholder="Ancien mot de passe"
                                />
                            </div>   <label>Nouveau mot de passe</label>
                            <div className="input-container">
                                <input type={showNewPassword ? "text" : "password"} name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Nouveau mot de passe" />
                                {showNewPassword ? <FaEyeSlash onClick={() => setShowNewPassword(false)} /> : <FaEye onClick={() => setShowNewPassword(true)} />}
                            </div>
                            <label>Confirmer le mot de passe</label>
                            <div className="input-container">
                                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmez le mot de passe" />
                                {showConfirmPassword ? <FaEyeSlash onClick={() => setShowConfirmPassword(false)} /> : <FaEye onClick={() => setShowConfirmPassword(true)} />}
                            </div>
                            <div className="modal-buttons">
                                <button className="ann" onClick={() => setShowModal(false)}>Annuler</button>
                                <button className="val" onClick={handleSubmit}>Valider</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Parametre;
