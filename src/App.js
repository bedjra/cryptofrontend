import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login/Login.jsx";
import Principale from "./principale/Principale.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accueil" element={<Principale />} />
      </Routes>
    </Router>
  );
}

export default App;
