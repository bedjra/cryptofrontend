import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

// Import des composants
import Login from "./Login/Login.jsx";
import Principale from "./principale/Principale.jsx";
import Accueil from "./principale/pages/Accueil/Accueil.jsx";
import Transactions from "./principale/pages/Transactions/Transactions.jsx";
import Fournisseurs from "./principale/pages/Fournisseurs/Fournisseurs.jsx";
import Beneficiaires from "./principale/pages/Beneficiaires/Beneficiaires.jsx";
import Historique from "./principale/pages/Historique/Historiques.jsx";
import Calculs from "./principale/pages/Calculs/Calculs.jsx";
import Parametre from "./principale/pages/Parametre/Parametre.jsx";

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Redirection vers le login si on actualise une autre page */}
        <Route path="*" element={<RedirectToLogin />} />

        <Route path="" element={<Principale />}>
          <Route path="accueil" element={<Accueil />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="fournisseurs" element={<Fournisseurs />} />
          <Route path="beneficiaires" element={<Beneficiaires />} />
          <Route path="historique" element={<Historique />} />
          <Route path="calculs" element={<Calculs />} />
          <Route path="profil" element={<Parametre />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
