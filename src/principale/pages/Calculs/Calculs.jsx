import React, { useEffect, useState } from "react";
import "./Calculs.css";

const Calculs = () => {
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/total/tr") // Remplace par ton URL backend
      .then((response) => response.json())
      .then((data) => setTotalTransactions(data.total))
      .catch((error) =>
        console.error("Erreur lors de la récupération des transactions:", error)
      );
  }, []);

  const openPopup = (index) => {
    setSelectedTransaction(index + 1); // On stocke la transaction sélectionnée
  };

  const closePopup = () => {
    setSelectedTransaction(null);
  };

  return (
    <main className="dash">
      <section className="summar grid grid-cols-3 gap-4">
        {Array.from({ length: totalTransactions }).map((_, index) => (
          <div key={index} className="carre" onClick={() => openPopup(index)}>
            <h3>Transaction {index + 1}</h3>
          </div>
        ))}
      </section>

      {/* Popup Modal */}
      {selectedTransaction !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Transaction {selectedTransaction}</h2>
            <button onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Calculs;
