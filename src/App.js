import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Import des composants
import Login from "./Login/Login.jsx";
import Principale from "./principale/Principale.jsx";
import Accueil from "./principale/pages/Accueil/Accueil.jsx";
import Transactions from "./principale/pages/Transactions/Transactions.jsx";
import Beneficiaires from "./principale/pages/Beneficiaires/Beneficiaires.jsx";
import Historique from "./principale/pages/Historique/Historiques.jsx";
import Calculs from "./principale/pages/Calculs/Calculs.jsx";
import Parametre from "./principale/pages/Parametre/Parametre.jsx";
import Four from "./principale/pages/Fournisseurs/Four.jsx";



function App() {
  // Détecter le rafraîchissement de la page et rediriger
  useEffect(() => {
    // Créer une fonction pour vérifier si c'est un rafraîchissement
    const checkForRefresh = () => {
      const navigationType = performance.getEntriesByType("navigation")[0].type;
      if (navigationType === "reload") {
        window.location.href = "/";
      }
    };

    // Exécuter la vérification
    checkForRefresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="" element={<Principale />}>
          <Route path="accueil" element={<Accueil />} />
          <Route path="transactions" element={<Transactions />} />
          {/*
          <Route path="fournisseurs" element={<Fournisseurs />} />
       */}
          <Route path="fournisseurs" element={<Four />} />

          <Route path="historique" element={<Historique />} />
          <Route path="profil" element={<Parametre />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;