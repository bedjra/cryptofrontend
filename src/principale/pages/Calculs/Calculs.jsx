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
        const response = await fetch(`${apiUrl}/total/tr`);
        const data = await response.json();
        const total = data.total;

        const transactionDetails = await Promise.all(
          Array.from({ length: total }, async (_, index) => {
            const transResponse = await fetch(`${apiUrl}/trans/${index + 1}`);
            return transResponse.json();
          })
        );

        setTransactions(transactionDetails);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const openPopup = async (transaction) => {
    setSelectedTransaction(transaction);
    try {
      const response = await fetch(`${apiUrl}/cal/${transaction.id}`);
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
            <p>Taux : {transaction.tauxConv} </p>

          </div>
        ))}
      </section>

      {selectedTransaction && detailsTransaction && (
        <div className="moda">
          <div className="moda-content">
            
            <h4>CALCUL DE LA TRANSACTION {selectedTransaction.id}</h4>
            <hr className="separat" />
            <p className="last">Transaction</p>
            <p>Id: {selectedTransaction.id}</p>
            <p >Montant  : {selectedTransaction.montantFCFA.toLocaleString()} FCFA</p>
            <p > Taux : {selectedTransaction.tauxConv.toLocaleString()} </p>
            <p className="fcfa">UDST  : {selectedTransaction.montantUSDT.toLocaleString()} </p>

            <p className="last">Benefice Fournisseur</p>
            <ul className="list">
              {detailsTransaction.benefices_fournisseurs.map((benef, index) => (
                <li key={index} className="list-item">
                  {benef.fournisseur} : {benef.benefice_total_FCFA.toLocaleString()} FCFA
                </li>
              ))}
            </ul>
            <p className="last" >REPARTITION DES BENEFICIAIRES</p>

            <ul className="list">
              {detailsTransaction.repartition_beneficiaires.map((benef, index) => (
                <li key={index} className="list-item">
                  {benef.beneficiaire} : {benef.benefice_FCFA.toLocaleString()} FCFA
                </li>
              ))}
            </ul>

            <p className="last">RESUME GLOBAL</p>
            <p>Total Fournisseurs : {detailsTransaction.resume_global.benefice_total_fournisseurs.toLocaleString()} FCFA</p>

            <button className="close-btn" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}

      
    </main >
  );
};

export default Calculs;
