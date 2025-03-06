import React, { useEffect, useState } from "react";
import "./Historiques.css";
const apiUrl = "http://127.0.0.1:5000";

const Historique = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/cal/all`)

      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des transactions:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="global-container">
      <div className="leftsection">
        <h2>Historique des Transactions</h2>
        
        ici

        {loading ? (
          <p>Chargement des transactions...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID Transaction</th>
                <th>Date</th>
                <th>Montant (FCFA)</th>
                <th>Taux</th>
                <th>Montant (USDT)</th>
                <th>Fournisseurs</th>
                <th>Bénéficiaires</th>
                <th>Bénéfice Bénéficiaire (FCFA)</th>
                <th>Bénéfice Total (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((t, index) => (
                  <tr key={index}>
                    <td>{t.transaction_id}</td>
                    <td>{new Date(t.date_transaction).toLocaleDateString()}</td>
                    <td>{t.montant_FCFA} FCFA</td>
                    <td>{t.taux_convenu}</td>
                    <td>
                      {/* Calcul du montant en USDT s'il y a un taux de conversion disponible */}
                      {t.taux_convenu > 0 ? (t.taux_convenu / 600).toFixed(2) : "N/A"} USDT
                    </td>
                    <td>
                      {t.benefices_fournisseurs.length > 0
                        ? t.benefices_fournisseurs.map((f) => f.fournisseur).join(", ")
                        : "Aucun"}
                    </td>
                    <td>
                      {t.repartition_beneficiaires.length > 0
                        ? t.repartition_beneficiaires.map((b) => b.beneficiaire).join(", ")
                        : "Aucun"}
                    </td>
                    <td>
                      {t.repartition_beneficiaires.length > 0
                        ? t.repartition_beneficiaires.map((b) => b.benefice_FCFA).join(", ")
                        : "0"} FCFA
                    </td>
                    <td>{t.resume_global.benefice_total_fournisseurs} FCFA</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Aucune transaction trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Historique;



