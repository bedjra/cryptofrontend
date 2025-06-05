
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
      const [transactionRes, calculsRes] = await Promise.all([
        fetch(`${apiUrl}/tran/${transactionId}`),
        fetch(`${apiUrl}/call/${transactionId}`)
      ]);

      const transactionData = await transactionRes.json();
      const calculsData = await calculsRes.json();

      // Fusionne les deux
      const mergedData = {
        ...transactionData,
        calculs: calculsData.calculs_en_temps_reel
      };

      setSelectedFournisseurDetails(mergedData);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails ou des calculs:", error);
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
            ))}
          </tbody>
        </table>







        {/* Affichage de la modale */}
        {showModal && selectedFournisseurDetails && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-body">

                <div className="modal-header">
                  <h4 className="modal-title">🧾 Fournisseurs & Bénéficiaires</h4>
                  <button className="close-button" onClick={() => setShowModal(false)}>x</button>
                </div>

                <br />
                <hr />
                <br />

                {/* Liste des fournisseurs triée */}
                {selectedFournisseurDetails?.fournisseurs?.length > 0 && selectedFournisseurDetails?.calculs?.benefices_fournisseurs && (
                  <div className="fournisseur-list">
                    {selectedFournisseurDetails.calculs.benefices_fournisseurs
                      .map((bf, index) => {
                        const fournisseur = selectedFournisseurDetails.fournisseurs.find(f => f.nom === bf.fournisseur);
                        if (!fournisseur) return null;

                        return (
                          <div key={index} className="fournisseur-card">
                            <p><strong>{index + 1} - Nom :</strong> {fournisseur.nom}</p>
                            <p><strong>Taux :</strong> {fournisseur.tauxJour || "Non spécifié"}</p>
                            <p><strong>Quantité USDT :</strong> {fournisseur.quantiteUSDT || "Non spécifié"}</p>
                            <br />
                            {fournisseur.beneficiaires?.length > 0 && (
                              <div className="beneficiaire-list">
                                {fournisseur.beneficiaires.map((b, idx) => (
                                  <div key={idx} className="beneficiaire-card">
                                    <strong>{b.nom} : </strong>  {b.commissionUSDT} USDT
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}


                {/* Section Calculs */}
                {selectedFournisseurDetails?.calculs && (
                  <section className="section">
                    <h3 className="section-title">💰 Calculs des Bénéfices</h3>

                    <div className="calculs-grid">
                      {/* Bénéfice par fournisseur */}
                      <div className="card calcul-card">
                        <div className={selectedFournisseurDetails.calculs.benefices_fournisseurs?.length >= 2 ? "benefice-flex" : ""}>
                          {/* Tri des fournisseurs pour affichage */}
                          {selectedFournisseurDetails.calculs.benefices_fournisseurs
                            .sort((a, b) => a.fournisseur.localeCompare(b.fournisseur)) // Tri par nom
                            .map((bf, index) => (
                              <div key={index} className="benefice-box">
                                Bénéfice par USDT : {bf.benefice_par_USDT.toLocaleString()} 
                                <br />
                                {bf.fournisseur} : {bf.benefice_total_FCFA.toLocaleString()} FCFA
                                </div>
                            ))}
                        </div>
                      </div>

                      {/* Détails par bénéficiaire */}
                      <div className="card calcul-card">
                        <div className={Object.keys(selectedFournisseurDetails.calculs.details_par_fournisseur || {}).length >= 2 ? "detail-flex" : ""}>
                          {/* Tri des fournisseurs pour afficher les détails */}
                          {Object.entries(selectedFournisseurDetails.calculs.details_par_fournisseur || {})
                            .sort(([a], [b]) => a.localeCompare(b)) // Tri par nom de fournisseur
                            .map(([nomFournisseur, details], idx) => (
                              <div key={idx} className="detail-box">
                                <p className="detail-title">{nomFournisseur}</p>
                                <ul className="list">
                                  {/* Tri des bénéficiaires par nom */}
                                  {Object.entries(details.benefices_par_beneficiaire || {})
                                    .sort(([a], [b]) => a.localeCompare(b)) // Tri par nom de bénéficiaire
                                    .map(([nomBeneficiaire, benef], i) => (
                                      <li key={i}>
                                        {nomBeneficiaire} : <strong>{benef.benefice_FCFA?.toLocaleString()} FCFA</strong>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>

                    </div>
                  </section>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transactions;