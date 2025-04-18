import React, { useEffect, useState } from "react";
import "./Calculs.css";

const apiUrl = "http://127.0.0.1:5000";

const Calculs = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsTransaction, setDetailsTransaction] = useState(null);




  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Étape 1 : Récupérer la liste des transactions
        const response = await fetch(`${apiUrl}/total/trs`);
        const data = await response.json();

        if (!Array.isArray(data.transactions)) {
          throw new Error("Format invalide : 'transactions' doit être une liste");
        }

        console.log("Liste des transactions récupérées:", data.transactions);

        // Étape 2 : Récupérer chaque transaction par ID
        const transactionDetails = await Promise.all(
          data.transactions.map(async (id) => {
            try {
              const transResponse = await fetch(`${apiUrl}/tran/${id}`);
              if (!transResponse.ok) {
                throw new Error(`Erreur HTTP ${transResponse.status}`);
              }
              return await transResponse.json();
            } catch (error) {
              console.error(`Erreur pour la transaction ${id}:`, error);
              return null; // Ignore l'erreur
            }
          })
        );

        // Étape 3 : Filtrer les erreurs
        setTransactions(transactionDetails.filter(tr => tr !== null));
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      }
    };

    fetchTransactions();
  }, []);



  // Fonction pour ouvrir le popup et récupérer les calculs
  const openPopup = async (transaction) => {
    setSelectedTransaction(transaction);
    try {
      const response = await fetch(`${apiUrl}/call/${transaction.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      console.log("Détails calculs reçus:", data);
      setDetailsTransaction(data.calculs_en_temps_reel);
    } catch (error) {
      console.error("Erreur lors de la récupération des calculs:", error);
      alert(error.message || "Aucun fournisseur trouvé pour cette transaction");
      setDetailsTransaction(null);
    }
  };


  const closePopup = () => {
    setSelectedTransaction(null);
    setDetailsTransaction(null);
  };

  return (
    <main className="dash">
      <section className="summar grid grid-cols-3 gap-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="carre" onClick={() => openPopup(transaction)}>
            <h4>Transaction {transaction.id}</h4>
            <p>Montant : {transaction.montantFCFA} FCFA</p>
            <p>Taux : {transaction.tauxConv}</p>
          </div>
        ))}
      </section>
      {selectedTransaction && detailsTransaction && (
        <div className="moda">
          <div className="moda-content">

            {/* Bénéfices Fournisseurs */}
            <p className="last">Bénéfice Fournisseur</p>
            <ul className="list">
              {detailsTransaction.benefices_fournisseurs?.map((benef, index) => (
                <li key={index} className="list-item">
                  {benef.fournisseur} : {benef.benefice_total_FCFA.toLocaleString()} FCFA
                  </li>
              ))}
            </ul>

            {/* Détails par Fournisseur */}
            <p className="last">Détails par Bénéficiaire
            </p>
            <ul className="list">
              {Object.entries(detailsTransaction.details_par_fournisseur || {}).map(([nomFournisseur, details], index) => (
                <li key={index} className="list-item">
                  <ul>
                    {Object.entries(details.benefices_par_beneficiaire || {}).map(([nomBenef, benefDetails], idx) => (
                      <li key={idx} className="list-sub-item">
                        {nomBenef} : {benefDetails.benefice_FCFA?.toLocaleString() || "N/A"} FCFA
                      </li>
                    ))}
                  </ul>

                  Bénéfice Restant : {details.benefice_restant.toLocaleString()} FCFA

                </li>


              ))}
            </ul>

            {/* Résumé */}
            <p className="last">Résumé Global</p>
            <p>Total Fournisseurs : {detailsTransaction.resume_global?.benefice_total_fournisseurs?.toLocaleString() || "N/A"} FCFA</p>

            <button className="close-btn" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}


    </main>
  );
};

export default Calculs;
