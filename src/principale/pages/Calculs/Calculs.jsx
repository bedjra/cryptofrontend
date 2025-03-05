import React, { useEffect, useState } from "react";
import "./Calculs.css";

const Calculs = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsTransaction, setDetailsTransaction] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:5000/total/tr");
        const data = await response.json();
        const total = data.total;

        const transactionDetails = await Promise.all(
          Array.from({ length: total }, async (_, index) => {
            const transResponse = await fetch(`http://localhost:5000/trans/${index + 1}`);
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
      const response = await fetch(`http://localhost:5000/cal/${transaction.id}`);
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
            <h3>Transaction {transaction.id}</h3>
            <p>Montant: {transaction.montantFCFA} FCFA</p>
            <p>Taux: {transaction.tauxConv} </p>

          </div>
        ))}
      </section>

      {selectedTransaction && detailsTransaction && (
        <div className="moda">
          <div className="moda-content">
            <h3>CALCUL DE LA TRANSACTION {selectedTransaction.id}</h3>
            <hr className="separator" />
            <h4 >TRANSACTION</h4>
            <p><strong>ID:</strong> {selectedTransaction.id}</p>
             <p ><strong>Montant  :</strong> {selectedTransaction.montantFCFA.toLocaleString()} FCFA</p>
             <p ><strong> Taux :</strong> {selectedTransaction.tauxConv.toLocaleString()} </p>
            <p className="fcfa"><strong>UDST  :</strong> {selectedTransaction.montantUSDT.toLocaleString()} </p>
           
            <h5 >BENEFICIARE FOURNISSEURS</h5>
            <ul className="list">
              {detailsTransaction.benefices_fournisseurs.map((benef, index) => (
                <li key={index} className="list-item">
                  <strong className="">{benef.fournisseur} :</strong> {benef.benefice_total_FCFA.toLocaleString()} FCFA
                </li>
              ))}
            </ul>
            <h5 >REPARTITION DES BENEFICIAIRES</h5>

            <ul className="list">
              {detailsTransaction.repartition_beneficiaires.map((benef, index) => (
                <li key={index} className="list-item">
                  <strong>{benef.beneficiaire} :</strong> {benef.benefice_FCFA.toLocaleString()} FCFA
                </li>
              ))}
            </ul>

            <h5>RESUME GLOBAL</h5>
            <p><strong>Total Fournisseurs :</strong> {detailsTransaction.resume_global.benefice_total_fournisseurs.toLocaleString()} FCFA</p>

            <button className="close-btn" onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}

    </main>
  );
};

export default Calculs;
