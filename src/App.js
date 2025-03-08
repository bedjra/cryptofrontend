import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import des composants
import Login from "./Login/Login.jsx";
import Principale from "./principale/Principale.jsx";
import Accueil from "./principale/pages/Accueil/Accueil.jsx";
import Transactions from "./principale/pages/Transactions/Transactions.jsx";
import Fournisseurs from "./principale/pages/Fournisseurs/Fournisseurs.jsx";
import Beneficiaires from "./principale/pages/Beneficiaires/Beneficiaires.jsx";
import Historique from "./principale/pages/Historique/Historiques.jsx";
import Calculs from "./principale/pages/Calculs/Calculs.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour la page de login */}
        <Route path="/" element={<Login />} />

        {/* Route principale avec routes enfants */}
        <Route path="" element={<Principale />}>
          
          {/* Routes enfants */}
          <Route path="accueil" element={<Accueil />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="fournisseurs" element={<Fournisseurs />} />
          <Route path="beneficiaires" element={<Beneficiaires />} />
          <Route path="historique" element={<Historique />} />
          <Route path="calculs" element={<Calculs />} />

        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
