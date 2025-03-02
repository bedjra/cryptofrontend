import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, CreditCard, Truck, Users } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Importer le style

const Accueil = () => {
  // États pour stocker les données du backend
  const [totalBenefices, setTotalBenefices] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fournisseursActifs, setFournisseursActifs] = useState(0);
  const [totalBeneficiaires, setTotalBeneficiaires] = useState(0);

  // Fonction pour récupérer les données
  useEffect(() => {
    fetch("http://localhost:5000/total/been")
      .then((res) => res.json())
      .then((data) => setTotalBenefices(data.total_benefices || 0))
      .catch((err) => console.error("Erreur récupération bénéfices :", err));

    fetch("http://localhost:5000/total/tr")
      .then((res) => res.json())
      .then((data) => setTotalTransactions(data.total || 0))
      .catch((err) => console.error("Erreur récupération transactions :", err));

    fetch("http://localhost:5000/total/fr")
      .then((res) => res.json())
      .then((data) => setFournisseursActifs(data.total_fournisseurs || 0))
      .catch((err) => console.error("Erreur récupération fournisseurs :", err));

    fetch("http://localhost:5000/total/bn")
      .then((res) => res.json())
      .then((data) => setTotalBeneficiaires(data.total_beneficiaires || 0))
      .catch((err) => console.error("Erreur récupération bénéficiaires :", err));
  }, []);

  return (
    <main className="dashboard">
      {/* Section Résumé Global */}
      <section className="summary grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Bénéfices */}
        <div className="card">
          <DollarSign className="icon text-green-500" />
          <div>
            <h3 className="text-lg font-semibold">Total Bénéfices (FCFA)</h3>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={totalBenefices}
                text={`${totalBenefices.toLocaleString()}`}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#4caf50" },
                  text: { fill: "#4caf50", fontSize: "45px" },
                }}
              />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="card">
          <FaExchangeAlt className="icon text-blue-500" />
          <div>
            <h3 className="text-lg font-semibold">Total Transactions</h3>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={totalTransactions}
                text={`${totalTransactions}`}
                strokeWidth={10}
                styles={{
                  
                  path: { stroke: "#2196f3" },
                  text: { fill: "#2196f3", fontSize: "45px" },
                }}
              />
            </div>
          </div>
        </div>

        {/* Fournisseurs Actifs */}
        <div className="card">
          <Truck className="icon text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">Fournisseurs Actifs</h3>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={fournisseursActifs}
                text={`${fournisseursActifs}`}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#ff9800" },
                  text: { fill: "#ff9800", fontSize: "45px" },
                }}
              />
            </div>
          </div>
        </div>

        {/* Total Bénéficiaires */}
        <div className="card">
          <Users className="icon text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold">Total Bénéficiaires</h3>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={totalBeneficiaires}
                text={`${totalBeneficiaires}`}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#9c27b0" },
                  text: { fill: "#9c27b0", fontSize: "45px" },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Accueil;


