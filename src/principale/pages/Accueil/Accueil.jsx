import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, Creditcar, Truck, Users } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css"; // Importer le style

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
    // Récupérer les bénéficiaires depuis l'API
    fetch(`${apiUrl}/alll/ben`)
      .then((res) => res.json())
      .then((data) => {
        // Assure-toi que la réponse contient les bénéficiaires
        if (data && Array.isArray(data.beneficiaires)) {
          setBeneficiaires(data.beneficiaires);
        } else {
          setBeneficiaires([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération bénéficiaires :", err);
        setBeneficiaires([]);
        setLoading(false);
      });

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


    fetch(`${apiUrl}/accc/last`)
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data.transactions) ? data.transactions : []))
      .catch((err) => {
        console.error("Erreur lors de la récupération :", err);
        setTransactions([]); // ✅ On met une liste vide si erreur
      });


  }, []);

  return (
    <main className="dash">


      <div class="dashboard-container">
        <div class="stat-card">
          <div class="card-content">
            <div class="icon-container orange">
              <DollarSign className="icon" style={{ color: "white", fontSize: "100px" }} />
            </div>
            <div class="text-container">
              <span class="stat-values">{totalBenefices.toLocaleString()}</span>

              <div class="stat-header">
                <span class="stat-title">BÉNÉFICES</span>
              </div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="stat-subtitle">Total des bénéfices</div>
        </div>

        <div class="stat-card">
          <div class="card-content">
            <div class="icon-container green">
              <FaExchangeAlt style={{ color: "white", fontSize: "25px" }} />
            </div>

            <div class="text-container">
              <span class="stat-value">{totalTransactions}</span>

              <div class="stat-header">
                <span class="stat-title">TRANSACTIONS</span>
              </div>

            </div>
          </div>
          <div class="separator"></div>
          <div class="stat-subtitle">Total des transactions</div>
        </div>

        <div class="stat-card">
          <div class="card-content">
            <div class="icon-container red">
              <Truck style={{ color: "white", fontSize: "30px" }} />
            </div>
            <div class="text-container">
              <span class="stat-value">{fournisseursActifs}</span>
              <div class="stat-header">
                <span class="stat-title">FOURNISSEURS</span>
              </div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="stat-subtitle">Total des fournisseurs </div>
        </div>

        <div class="stat-card">
          <div class="card-content">
            <div class="icon-container blue">
              <Users style={{ color: "white", fontSize: "30px" }} />

            </div>
            <div class="text-container">
              <span class="stat-value">{totalBeneficiaires}</span>

              <div class="stat-header">
                <span class="stat-title">BÉNÉFICIAIRES</span>
              </div>
            </div>
          </div>
          <div class="separator"></div>
          <div class="stat-subtitle">Total des bénéficiaires</div>
        </div>

      </div>





      <div className="container">
        <div className="left-section">
          <h4>Répartition du Budget</h4>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Bénéficiaire</th>
                <th>Comm</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaires.length > 0 ? (
                beneficiaires.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.nom}</td>
                    <td>{b.commission_USDT}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    Aucun bénéficiaire trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="right-section">
          <h4>Taux des Transactions </h4>

          <table>
            <thead>
              <tr>
                <th >Id</th>
                <th >Fournisseur</th>
                <th >Taux </th>
              </tr>
            </thead>
            <tbody>
              {fournisseurs.map((f) => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.nom}</td>
                  <td>{f.taux_jour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div className="historique">
        <h3>Historique</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Montant</th>
              <th>Fournisseur</th>
              <th>Bénéfice (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(transactions) && transactions.length > 0 ? (
              transactions.map((t, index) => (
                <tr key={index}>
                  <td>{t.date_transaction ? t.date_transaction.split(" ")[0] : "N/A"}</td>
                  <td>{t.montant_FCFA || 0}</td>
                  <td>{t.fournisseur || "Aucun"}</td>
                  <td>{t.benefice_total_FCFA || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>Aucune transaction trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>



    </main>
  );
};

export default Accueil;













