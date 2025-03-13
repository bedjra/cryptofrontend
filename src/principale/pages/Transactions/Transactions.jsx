import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transactions.css";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

const apiUrl = "http://127.0.0.1:5000";

const Transactions = () => {
  
  const [montantFCFA, setMontantFCFA] = useState("");
  const [tauxConv, setTauxConv] = useState("");
  const [montantUSDT, setMontantUSDT] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);

  // Récupérer toutes les transactions au chargement du composant
  useEffect(() => {
    axios
      .get(`${apiUrl}/trans/all`)
      .then((response) => {
        setTransactions(response.data.transactions || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des transactions:", error);
      });
  }, []);

  useEffect(() => {
    if (montantFCFA && tauxConv) {
      setMontantUSDT(parseFloat(montantFCFA) / parseFloat(tauxConv));
    } else {
      setMontantUSDT("");
    }
  }, [montantFCFA, tauxConv]);

  const handleEnregistrer = async () => {
    if (!montantFCFA || !tauxConv) return;

    try {
      if (editingTransactionId) {
        // Mise à jour de la transaction
        const response = await axios.put(`${apiUrl}/trans/update/${editingTransactionId}`, {
          montantFCFA,
          tauxConv,
        });

        console.log("Réponse de mise à jour:", response.data); // 🔍 Vérifier la réponse reçue

        setTransactions(
          transactions.map((transaction) =>
            transaction.id === editingTransactionId ? response.data.transaction : transaction
          )
        );

        console.log("Transactions mises à jour:", transactions); // 🔍 Vérifier si le tableau est mis à jour
      } else {
        // Ajout d'une nouvelle transaction
        const response = await axios.post(`${apiUrl}/trans/add`, {
          montantFCFA,
          tauxConv,
        });

        setTransactions([...transactions, response.data.transaction]);
      }

      setMontantFCFA("");
      setTauxConv("");
      setMontantUSDT("");
      setEditingTransactionId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction:", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/trans/delete/${id}`);
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
    }
  };

  const handleEdit = (transaction) => {
    setMontantFCFA(transaction.montantFCFA);
    setTauxConv(transaction.tauxConv);
    setEditingTransactionId(transaction.id);
  };

  return (
    <div className="container">
      <div className="left-box">
        <h4>{editingTransactionId ? "Modifier" : "Ajouter"} une Transaction</h4>
        <div className="input-group">
          <span>Montant FCFA</span>
          <input type="number" value={montantFCFA} onChange={(e) => setMontantFCFA(e.target.value)} required />
        </div>
        <div className="input-group">
          <span>Taux de Conversion</span>
          <input type="number" value={tauxConv} onChange={(e) => setTauxConv(e.target.value)} required />
        </div>
        <div className="input-group">
          <span>Montant USDT</span>
          <input type="text" value={montantUSDT} disabled placeholder="Montant calculé automatiquement" />
        </div>
        <div className="but">
          <button className="save" onClick={handleEnregistrer}>
            {editingTransactionId ? "Modifier" : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="right-box">
        <h4 style={{ marginBottom: 25 }}> Gestion des Transactions</h4>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Mtt FCFA</th>
              <th>Taux</th>
              <th>Mtt USDT</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr >
                <td>{transaction.id}</td>
                <td>{transaction.montantFCFA}</td>
                <td>{transaction.tauxConv}</td>
                <td>{transaction.montantUSDT}</td>
                <td>
                  {transaction.dateTransaction
                    ? format(new Date(transaction.dateTransaction), "dd/MM/yyyy HH:mm")
                    : "Date invalide"}
                </td>
                <td>
                  <button onClick={() => handleEdit(transaction)} className="action-btn">
                    <Edit size={20} color="blue" />
                  </button> &nbsp;
                  <button onClick={() => handleDelete(transaction.id)} className="action-btn">
                    <Trash2 size={20} color="red" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Transactions;