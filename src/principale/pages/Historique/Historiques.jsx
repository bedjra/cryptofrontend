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
    let url = `${apiUrl}/cal/perid`;  // Correction de l'URL
    if (periode) {
      url += `?periode=${periode}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          setTransactions([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des transactions:", error);
        setTransactions([]);  // Sécuriser en cas d'erreur
        setLoading(false);
      });
  };

  return (
    <div className="historique">
      <h2>Historique des Transactions</h2>
      <div className="label">
        <label htmlFor="periode">Filtrer par :</label>
        <select id="periode" value={periode} onChange={(e) => setPeriode(e.target.value)}>
          <option value="">Toutes</option>
          <option value="jour">Journalier</option>
          <option value="mois">Mensuel</option>
        </select>
      </div>

      {loading ? (
        <p>Chargement des transactions...</p>
      ) : (
        <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>FCFA</th>
            <th>Fournisseur</th>
            <th>Bénéficiaire</th>
            <th>Bénéfice</th>
            <th>B. total</th>
          </tr>
        </thead>
      <tbody>
  {Array.isArray(transactions) && transactions.length > 0 ? (
    transactions.map((t, index) => (
      <tr key={index}>
        <td>{t.transaction_id}</td>
        <td>{new Date(t.date_transaction).toLocaleDateString()}</td>
        <td>{t.montant_FCFA} </td>

        <td>
          {Array.isArray(t.benefices_fournisseurs) && t.benefices_fournisseurs.length > 0
            ? t.benefices_fournisseurs.map((f) => (
                <div className="fournisseur-nom" key={f.fournisseur}>{f.fournisseur}</div>
              ))
            : "Aucun"}
        </td>
        <td>
          {t.details_par_fournisseur
            ? Object.values(t.details_par_fournisseur)
                .flatMap((f) => Object.keys(f.benefices_par_beneficiaire))
                .map((beneficiaire, i) => (
                  <div className="beneficiaire-nom" key={i}>{beneficiaire}</div>
                ))
            : "Aucun"}
        </td>
        <td>
          {t.details_par_fournisseur
            ? Object.values(t.details_par_fournisseur)
                .flatMap((f) => Object.values(f.benefices_par_beneficiaire).map(b => (
                  <div className="benefice-valeur" key={b.benefice_FCFA}>{b.benefice_FCFA}</div>
                )))
            : "0"} 
        </td>
        <td>{t.resume_global?.benefice_total_fournisseurs || 0} </td>
        <td></td>

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
  );
};

export default Historique;
