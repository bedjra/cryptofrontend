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

    fetch(`${apiUrl}/acc/last`)
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions))
      .catch((err) => console.error("Erreur lors de la récupération :", err));


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
                <th >Bénéficiaire</th>
                <th >Commission</th>
                <th > Bénéfice (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaires.map((b) => (
                <tr key={b.id}>
                  <td >{b.nom}</td>
                  <td>{b.commission_USDT} </td>
                  <td>{b.benefice_FCFA} </td>
                </tr>
              ))}
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


      <div className="historique" >
        <h3 >Historique </h3>
        <table >
          <thead >
            <tr>
              <th >Date & Heure</th>
              <th>Montant</th>
              <th>Fournisseur</th>
              <th>Bénéfice (FCFA)</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, index) => (
              <tr key={index}>
                <td>{t.date}</td>
                <td>{t.montant_FCFA}</td>
                <td>
                  {t.fournisseurs.length > 0
                    ? t.fournisseurs.map((f) => f.nom).join(", ")
                    : "Aucun"}
                </td>
                <td>{t.benefice_total} </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>


    </main>
  );
};

export default Accueil;













