import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "./Login.css";

// Utilisation de la variable d'environnement pour l'URL de l'API
const apiUrl = "http://127.0.0.1:5000";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Création du corps de la requête
    const data = {
      email: email,
      password: password,
    };

    try {
      // Envoi de la requête POST à l'API Flask
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Convertir l'objet JS en JSON
      });

      if (response.ok) {
        // Si la réponse est réussie (status 200)
        console.log("Connexion réussie !");
        alert("Connecté avec succès !");
        navigate("/accueil"); // Redirige vers l'accueil
      } else if (response.status === 401) {
        // Si le serveur retourne une erreur 401 (mauvais identifiants)
        const errorData = await response.json(); // Lire la réponse JSON
        console.error("Erreur de connexion : ", errorData.message);
        alert("Email ou mot de passe incorrect !");
      } else {
        // Pour d'autres codes d'erreur HTTP
        console.error("Erreur de connexion : ", response.statusText);
        alert("Erreur de connexion au serveur !");
      }
    } catch (error) {
      // Si une erreur se produit côté client
      console.error("Erreur lors de la requête : ", error);
      alert("Problème de connexion au serveur !");
    }
  };

  return (
    <div className="all">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <div className="formm">
        <form onSubmit={handleSubmit}>
          <h3>
            <span className="l">L</span>ogin
          </h3>
          <h5 className="login-text">
            Entrez vos identifiants pour vous connecter.
          </h5>

          <label htmlFor="email">
            <FaEnvelope /> Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">
            <FaLock /> Password
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit">Connexion</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
