import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, CreditCard, Truck, Users } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Importer le style
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const Accueil = () => {
  const [totalBenefices, setTotalBenefices] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fournisseursActifs, setFournisseursActifs] = useState(0);
  const [totalBeneficiaires, setTotalBeneficiaires] = useState(0);

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
      <section className="summary">
        {/* Total Bénéfices */}
        <div className="card">
          <div className="card-top">
            <div className="card-text">
              <h3> Bénéfices </h3>
              <p>{totalBenefices.toLocaleString()}</p>
            </div>

            <div className="card-chart">
              <CircularProgressbarWithChildren
                value={totalBenefices}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#4caf50" },
                }}
              >
                <DollarSign className="icon" style={{ color: "black", fontSize: "30px" }} />
              </CircularProgressbarWithChildren>
            </div>

          </div>
          <div className="card-bottom">
            <DollarSign className="icon" />
          </div>
        </div>

        {/* Total Transactions */}
        <div className="card">

          <div className="card-top">
            <div className="card-text">
              <h3>Transactions</h3>
              <p>{totalTransactions}</p>
            </div>
            <div className="card-chart">
              <CircularProgressbarWithChildren
                value={totalTransactions}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#2196f3" },
                }}
              >
                <FaExchangeAlt style={{ color: "black", fontSize: "30px" }} />
              </CircularProgressbarWithChildren>
            </div>
          </div>

          <div className="card-bottom">
            <FaExchangeAlt className="icon" />
          </div>
        </div>

        {/* Fournisseurs Actifs */}
        <div className="card">

          <div className="card-top">
            <div className="card-text">
              <h3>Fournisseurs</h3>
              <p>{fournisseursActifs}</p>
            </div>
            <div className="card-chart">
              <CircularProgressbarWithChildren
                value={fournisseursActifs}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#ff9800" },
                }}
              >
                <Truck style={{ color: "black", fontSize: "30px" }} />
              </CircularProgressbarWithChildren>
            </div>
          </div>
          <div className="card-bottom">
          </div>
        </div>

        {/* Total Bénéficiaires */}
        <div className="card">
          <div className="card-top">
            <div className="card-text">
              <h3>Bénéficiaires</h3>
              <p>{totalBeneficiaires}</p>
            </div>
            <div className="card-chart">
              <CircularProgressbarWithChildren
                value={totalBeneficiaires}
                strokeWidth={10}
                styles={{
                  path: { stroke: "#9c27b0" },
                }}
              >
                <Users style={{ color: "black", fontSize: "30px" }} />
              </CircularProgressbarWithChildren>
            </div>
          </div>
          <div className="card-bottom">
            <Users className="icon" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Accueil;
