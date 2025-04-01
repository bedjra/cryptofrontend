import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trans.css";
import { Trash2, Edit, DollarSign, Eye } from "lucide-react";
import { format } from "date-fns";

const apiUrl = "http://127.0.0.1:5000";

const Tran = () => {
  const [montantFCFA, setMontantFCFA] = useState("");
  const [tauxConv, setTauxConv] = useState("");
  const [montantUSDT, setMontantUSDT] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFournisseurDetails, setSelectedFournisseurDetails] = useState(null);




  const removeFournisseur = (index) => {
    setFournisseursSelectionnes(fournisseursSelectionnes.filter((_, i) => i !== index));
  };
  const [fournisseursSelectionnes, setFournisseursSelectionnes] = useState([{ id: "", nom: "" }]);
  const addFournisseur = () => {
    setFournisseursSelectionnes([...fournisseursSelectionnes, { id: "", nom: "" }]);
  };
  const handleFournisseurChange = (index, event) => {
    const newFournisseurs = [...fournisseursSelectionnes];
    const selectedId = event.target.value;
    const selectedNom = fournisseurs.find(f => f.id === selectedId)?.nom || "";
    
    newFournisseurs[index] = { id: selectedId, nom: selectedNom };
    setFournisseursSelectionnes(newFournisseurs);
  };

  

  

  const handleShowDetails = async (transactionId) => {
    try {
      const response = await axios.get(`${apiUrl}/tran/${transactionId}`);
      setSelectedFournisseurDetails(response.data.transaction);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la transaction:", error);
    }
  };

  // Récupération des transactions
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

  // Récupération des fournisseurs
  useEffect(() => {
    axios
      .get(`${apiUrl}/all/fourn`)
      .then((response) => {
        setFournisseurs(response.data.fournisseurs || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des fournisseurs:", error);
      });
  }, []);

  useEffect(() => {
    if (montantFCFA && tauxConv) {
      const montant = parseFloat(montantFCFA) / parseFloat(tauxConv);
      setMontantUSDT(montant.toFixed(3)); // Arrondi à 3 décimales
    } else {
      setMontantUSDT("");
    }
  }, [montantFCFA, tauxConv]);

  const handleEnregistrer = async () => {
    if (!montantFCFA || !tauxConv || !selectedFournisseur) return;
    try {
      const transactionData = { montantFCFA, tauxConv, fournisseurId: selectedFournisseur };
      let response;
      if (editingTransactionId) {
        response = await axios.put(`${apiUrl}/trans/update/${editingTransactionId}`, transactionData);
        setTransactions(transactions.map(t => (t.id === editingTransactionId ? response.data.transaction : t)));
      } else {
        response = await axios.post(`${apiUrl}/trans/addd`, transactionData);
        setTransactions([...transactions, response.data.transaction]);
      }
      setMontantFCFA("");
      setTauxConv("");
      setMontantUSDT("");
      setSelectedFournisseur("");
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
    setSelectedFournisseur(transaction.fournisseurId);
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
          <span>Taux Convenu</span>
          <input type="number" value={tauxConv} onChange={(e) => setTauxConv(e.target.value)} required />
        </div>


        {fournisseursSelectionnes.map((fournisseur, index) => (
  <div key={index} className="input-group">
    
    <div className="input-header">
      <span>Fournisseur {index + 1}</span>
      
      {index === 0 && ( 
        <a className="add-icon" onClick={addFournisseur}>➕</a>
      )}
      
      {index > 0 && ( 
        <a className="delete-icon" onClick={() => removeFournisseur(index)}>❌</a>
      )}
    </div>

    {/* Sélecteur de fournisseur */}
    <select value={fournisseur.id} onChange={e => handleFournisseurChange(index, e)} required>
      <option value="">Sélectionner un Fournisseur</option>
      {fournisseurs.map(f => (
        <option key={f.id} value={f.id}>{f.nom}</option>
      ))}
    </select>
    
  </div>
))}






        {tauxConv && (
          <div affichage>
            {montantFCFA} montant Fcfa =
            <br />
            <p className="mont">
              {montantUSDT} <DollarSign className="icon-dollar" />
            </p>
          </div>
        )}

        <div className="but">
          <button className="save" onClick={handleEnregistrer}>
            {editingTransactionId ? "Modifier" : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="right-box">
        <h4 style={{ marginBottom: 25 }}>Gestion des Transactions</h4>
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
            {transactions.map((transaction) => {
              // Trouver le fournisseur correspondant à la transaction
              const fournisseur = fournisseurs.find(f => f.id === transaction.fournisseur?.id);

              return (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.montantFCFA}</td>
                  <td>{transaction.tauxConv}</td>
                  <td>{transaction.montantUSDT}</td>
                  <td>
                    {transaction.dateTransaction
                      ? format(new Date(transaction.dateTransaction), "dd/MM/yyyy")
                      : "Date invalide"}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(transaction)} className="action-btn">
                      <Edit size={20} color="blue" />
                    </button>
                    <button onClick={() => handleDelete(transaction.id)} className="action-btn">
                      <Trash2 size={20} color="red" />
                    </button>
                    <button
                      onClick={() => handleShowDetails(transaction.id)}
                      className="action-btn"
                    >
                      <Eye size={21} color="green" />
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Affichage de la modale */}
        {showModal && selectedFournisseurDetails && (
          <div className="overlay" onClick={() => setShowModal(false)}>
            <div className="content" onClick={(e) => e.stopPropagation()}>
              <div className="popup-content-header">
                <h4>Détails de la Transaction</h4>
              </div>

              <div className="popup-body">
                <div className="details-container">
                  <div className="column">
                    <h5>Transaction</h5>
                    <p><strong>Montant FCFA:</strong> {selectedFournisseurDetails.montantFCFA}</p>
                    <p><strong>Taux Convenu:</strong> {selectedFournisseurDetails.tauxConv}</p>
                    <p><strong>Montant USDT:</strong> {selectedFournisseurDetails.montantUSDT}</p>
                    <p><strong>Date:</strong> {format(new Date(selectedFournisseurDetails.dateTransaction), "dd/MM/yyyy")}</p>
                  </div>

                  {selectedFournisseurDetails.fournisseur && (
                    <div className="column">
                      <h5>Fournisseur</h5>
                      <p><strong>Nom:</strong> {selectedFournisseurDetails.fournisseur.nom}</p>
                      <p><strong>Taux du Jour:</strong> {selectedFournisseurDetails.fournisseur.taux_jour}</p>
                      <p><strong>Quantité USDT:</strong> {selectedFournisseurDetails.fournisseur.quantite_USDT}</p>
                    </div>
                  )}
                </div>

                {selectedFournisseurDetails.fournisseur?.beneficiaires.length > 0 && (

                  <div className="beneficiaires">

                    {selectedFournisseurDetails.fournisseur.beneficiaires.map((b) => (
                      <div key={b.id} className="beneficiaire">
                        <h5>Bénéficiaires</h5>

                        <p><strong>Nom:</strong> {b.nom}</p>
                        <p><strong>Commission (USDT):</strong> {b.commission_USDT}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button className="close-btn" onClick={() => setShowModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tran;
