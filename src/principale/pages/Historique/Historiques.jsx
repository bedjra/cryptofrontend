import React, { useEffect, useState } from "react";
import "./Historiques.css";

const apiUrl = "http://127.0.0.1:5000";

const Historique = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [periode]);

  const fetchTransactions = () => {
    setLoading(true);
    let url = `${apiUrl}/cal/peri`;
    if (periode) {
      url += `?periode=${periode}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des transactions:", error);
        setLoading(false);
      });
  };

  return (

      <div className="historique">

        <h2>Historique des Transactions</h2>

        <label htmlFor="periode">Filtrer par période :</label>
        <select id="periode" value={periode} onChange={(e) => setPeriode(e.target.value)}>
          <option value="">Toutes</option>
          <option value="jour">Journalier</option>
          <option value="mois">Mensuel</option>
          <option value="annee">Annuel</option>
        </select>

        {loading ? (
          <p>Chargement des transactions...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Date</th>
                <th>Montant (FCFA)</th>
                <th>Taux</th>
                <th>Montant UDST </th>
                <th>Fournisseurs</th>
                <th>Bénéficiaires</th>
                <th>Bénéfice Bénéficiaire</th>
                <th>Bénéfice Total </th>
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
                    <td>{t.montant_USDT}</td>
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
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Aucune transaction trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
  );
};

export default Historique;
