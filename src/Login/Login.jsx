import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import axios from "axios"; // Importer Axios
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Création du corps de la requête
    const data = {
      email: email,
      password: password,
    };
    // Utilisation de la variable d'environnement pour l'URL de l'API
    const apiUrl = "http://127.0.0.1:5000";

    // Envoi de la requête POST à l'API Flask
    axios
    .post(`${apiUrl}/login`, data, { 
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // Si la connexion est réussie
      console.log("Connexion réussie !");
      alert("Connecté avec succès !");
      navigate("/accueil"); // Redirige vers l'accueil
    })
    .catch((error) => {
      // En cas d'erreur, par exemple mauvais identifiants
      if (error.response) {
        console.error("Erreur de connexion : ", error.response.data);
        alert("Email ou mot de passe incorrect !");
      } else if (error.request) {
        console.error("Pas de réponse du serveur : ", error.request);
        alert("Problème de connexion au serveur !");
      } else {
        console.error("Erreur de configuration : ", error.message);
      }
    });
  
  };

  return (
    <div className="all">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
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
  );
}

export default Login;
