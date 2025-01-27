import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification temporaire des identifiants
    if (email === "armel@gmail.com" && password === "1234") {
      console.log("Connexion réussie !");
      alert("Connecté avec succès !");
      navigate("/accueil"); // Redirige vers Principale
    } else {
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <div>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>
          <span className="l">L</span>ogin
        </h3>
        <p className="login-text">
        Entrez vos identifiants pour vous connecter.        </p>
        
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
