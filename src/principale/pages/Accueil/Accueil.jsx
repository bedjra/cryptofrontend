import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, CreditCard, Truck, Users } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Importer le style
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const apiUrl = "http://127.0.0.1:5000";

const Accueil = () => {
  const [totalBenefices, setTotalBenefices] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fournisseursActifs, setFournisseursActifs] = useState(0);
  const [totalBeneficiaires, setTotalBeneficiaires] = useState(0);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    fetch(`${apiUrl}/total/been`)
      .then((res) => res.json())
      .then((data) => setTotalBenefices(data.benefice_global_total || 0)) // Correction ici
      .catch((err) => console.error("Erreur récupération bénéfices :", err));

    fetch(`${apiUrl}/total/tr`)
      .then((res) => res.json())
      .then((data) => setTotalTransactions(data.total || 0))
      .catch((err) => console.error("Erreur récupération transactions :", err));

    fetch(`${apiUrl}/total/fr`)
      .then((res) => res.json())
      .then((data) => setFournisseursActifs(data.total_fournisseurs || 0))
      .catch((err) => console.error("Erreur récupération fournisseurs :", err));

    fetch(`${apiUrl}/total/bn`)
      .then((res) => res.json())
      .then((data) => setTotalBeneficiaires(data.total_beneficiaires || 0))
      .catch((err) => console.error("Erreur récupération bénéficiaires :", err));

    fetch(`${apiUrl}/four/taux`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des taux");
        }
        return response.json();
      })
      .then((data) => {
        setFournisseurs(data.fournisseurs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des taux");
        setLoading(false);
      });

    fetch(`${apiUrl}/benef/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des bénéficiaires");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données bénéficiaires :", data); // ✅ Debug
        setBeneficiaires(Array.isArray(data.beneficiaires) ? data.beneficiaires : []);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    fetch("http://localhost:5000/acc/last")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions))
      .catch((err) => console.error("Erreur lors de la récupération :", err));


  }, []);

  return (
    <main className="dashboard">
      <section className="summary">
        {/* Total Bénéfices */}
        <div className="card">
          <div className="card-top">
            <div className="card-text">
              <h3> Bénéfices total </h3>
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

      <div className="global-container">
        {/* Section Gauche */}
        <div className="left-section">
          <h2>Répartition du Budget par Bénéficiaire</h2>

          <table>
            <thead>
              <tr>
                <th className="dif">Bénéficiaire</th>
                <th className="dif">Commission</th>
                <th className="dif"> Bénéfice</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaires.map((b) => (
                <tr key={b.id}>
                  <td >{b.nom}</td>
                  <td>{b.commission_USDT} USDT</td> {/* Correction du nom de la clé */}
                  <td >{b.benefice_FCFA} FCFA</td> {/* Correction du nom de la clé */}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Section Droite */}
        <div className="right-section">
          <h2>Taux des Transaction en Temps Réel</h2>

          <table>
            <thead>
              <tr>
                <th className="dif">Fournisseur</th>
                <th className="dif">Taux du Jour</th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((f) => (
                <tr key={f.id}>
                  <td>{f.nom}</td>
                  <td>{f.taux_jour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="global-container">
        <div className="leftsection">
          <h2 >Historique des Trois dernières Transactions</h2>
          <table >
            <thead >
              <tr>
                <th >Date & Heure</th>
                <th>Montant (FCFA)</th>
                <th>Fournisseur</th>
                <th>Bénéfice (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={index}>
                  <td>{t.date}</td>
                  <td>{t.montant_FCFA} FCFA</td>
                  <td>
                    {t.fournisseurs.length > 0
                      ? t.fournisseurs.map((f) => f.nom).join(", ")
                      : "Aucun"}
                  </td>
                  <td>{t.benefice_total} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


     

    </main>
  );
};

export default Accueil;
