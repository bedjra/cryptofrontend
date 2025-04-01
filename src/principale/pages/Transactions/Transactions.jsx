
import "./Transactions.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, DollarSign, Eye } from "lucide-react";
import { format } from "date-fns";

const apiUrl = "http://127.0.0.1:5000";

const Transactions = () => {
  const [montantFCFA, setMontantFCFA] = useState("");
  const [tauxConv, setTauxConv] = useState("");
  const [montantUSDT, setMontantUSDT] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFournisseurDetails, setSelectedFournisseurDetails] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectionnes, setSelectionnes] = useState([]);

  console.log("Transactions affichées :", transactions);

  // Calcul automatique du montant USDT
  useEffect(() => {
    if (montantFCFA && tauxConv) {
      const montant = parseFloat(montantFCFA) / parseFloat(tauxConv);
      setMontantUSDT(montant.toFixed(3)); // Arrondi à 3 décimales
    } else {
      setMontantUSDT("");
    }
  }, [montantFCFA, tauxConv]);

  // Récupération des transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/trans/alll`);
        console.log("Données reçues :", response.data);

        if (Array.isArray(response.data)) {
          setTransactions(response.data); // ✅ Si c'est un tableau, on l'assigne
        } else {
          console.error("Format de réponse invalide :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      }
    };

    fetchTransactions();
  }, []); // ✅ Appelé une seule fois au montage


  // Récupération des fournisseurs
  useEffect(() => {
    axios
      .get(`${apiUrl}/all/fourn`)
      .then((response) => {
        setFournisseurs(response.data.fournisseurs || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des fournisseurs :", error);
      });
  }, []);

  const handleSelectionChange = (id) => {
    let newSelection = [...selectionnes];
    if (newSelection.includes(id)) {
      newSelection = newSelection.filter((fournId) => fournId !== id);
    } else {
      newSelection.push(id);
    }
    setSelectionnes(newSelection);
  };

  const handleShowDetails = async (transactionId) => {
    try {
      const response = await fetch(`${apiUrl}/tran/${transactionId}`);
      const data = await response.json();
      setSelectedFournisseurDetails(data);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
    }
  };

  const handleEnregistrer = async () => {
    if (!montantFCFA || !tauxConv || selectionnes.length === 0) {
      alert("Veuillez remplir tous les champs et sélectionner au moins un fournisseur");
      return;
    }

    try {
      const transactionData = {
        montantFCFA: parseFloat(montantFCFA),
        tauxConv: parseFloat(tauxConv),
        fournisseursIds: selectionnes.map(id => parseInt(id))
      };

      console.log("Données à envoyer:", transactionData);

      let response;
      if (editingTransactionId) {
        response = await axios.put(`${apiUrl}/trans/update/${editingTransactionId}`, transactionData);
        setTransactions(transactions.map(t => (t.id === editingTransactionId ? response.data.transaction : t)));
      } else {
        response = await axios.post(`${apiUrl}/trans/addd`, transactionData);
        setTransactions([...transactions, response.data.transaction]);
      }

      // Réinitialisation des champs
      setMontantFCFA("");
      setTauxConv("");
      setMontantUSDT("");
      setSelectionnes([]);
      setEditingTransactionId(null);

      alert(editingTransactionId ? "Transaction modifiée avec succès!" : "Transaction ajoutée avec succès!");

    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la transaction:", error.response ? error.response.data : error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?");

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/trans/delete/${id}`);
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
      alert("Transaction supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de la transaction:", error);
      alert("Une erreur s'est produite lors de la suppression.");
    }
  };

  const handleEdit = (transaction) => {
    setMontantFCFA(transaction.montantFCFA);
    setTauxConv(transaction.tauxConv);
    setEditingTransactionId(transaction.id);

    // Récupérer les IDs des fournisseurs de la transaction
    const fournisseursIds = transaction.fournisseurs.map(f => f.id);
    setSelectionnes(fournisseursIds);
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

        <div className="fournisseurs-container">
          <span>Fournisseur</span>

          {/* Faux select */}
          <div className="custom-select" onClick={() => setShowDropdown(!showDropdown)}>
            {selectionnes.length > 0
              ? fournisseurs
                .filter((f) => selectionnes.includes(f.id))
                .map((f) => f.nom)
                .join(", ")
              : "Sélectionner un fournisseur..."}
          </div>

          {/* Liste déroulante avec checkboxes */}
          {showDropdown && (
            <div className="dropdown">
              {fournisseurs.map((f) => (
                <div key={f.id} className="dropdown-item">
                  <input
                    type="checkbox"
                    value={f.id}
                    checked={selectionnes.includes(f.id)}
                    onChange={() => handleSelectionChange(f.id)}
                  />
                  <span>{f.nom}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {tauxConv && montantFCFA && (
          <div className="affichage">
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
            {transactions.map((transaction) => (
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
                  {/* 

                  <button onClick={() => handleEdit(transaction)} className="action-btn">
                    <Edit size={20} color="blue" />
                  </button>
                         */}

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
            ))}
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
                        {/* 

                <div className="details-container">
                  <div className="column">
                    <h5>Transaction</h5>
                    <p><strong>Montant FCFA:</strong> {selectedFournisseurDetails.montantFCFA}</p>
                    <p><strong>Taux Convenu:</strong> {selectedFournisseurDetails.tauxConv}</p>
                    <p><strong>Montant USDT:</strong> {selectedFournisseurDetails.montantUSDT}</p>
                    <p><strong>Date:</strong> {selectedFournisseurDetails.dateTransaction ?
                      format(new Date(selectedFournisseurDetails.dateTransaction), "dd/MM/yyyy") :
                      "Date invalide"}</p>
                  </div>
                </div>
*/}
                {selectedFournisseurDetails.fournisseurs?.length > 0 && (
                  <div className="fournisseurs">
                    <h5>Fournisseurs & Bénéficiaires </h5>
                    {selectedFournisseurDetails.fournisseurs.map((fournisseur, index) => (
                      <div key={index} className="fournisseur">
                        <p><strong>{index + 1} - Nom :</strong> {fournisseur.nom}</p>
                        <p><strong>Taux :</strong> {fournisseur.tauxJour}</p>
                        <p><strong>Quantité USDT :</strong> {fournisseur.quantiteUSDT}</p>

                        {fournisseur.beneficiaires && fournisseur.beneficiaires.length > 0 && (
                          <div className="beneficiaires">
                            <h5>Bénéficiaires</h5>
                            {fournisseur.beneficiaires.map((b, idx) => (
                              <div key={idx} className="beneficiaire">
                                <p><strong>Nom :</strong> {b.nom}</p>
                                <p><strong>Commission (USDT):</strong> {b.commissionUSDT}</p>
                              </div>
                            ))}
                          </div>
                        )}
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

export default Transactions;