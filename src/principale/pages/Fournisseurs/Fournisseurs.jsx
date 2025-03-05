import "./Fournisseurs.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Eye } from "lucide-react";

const apiUrl = "http://127.0.0.1:5000";

const Fournisseurs = () => {
  const [nomFournisseur, setNomFournisseur] = useState("");
  const [tauxJour, setTauxJour] = useState("");
  const [quantiteDisponible, setQuantiteDisponible] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [editingFournisseurId, setEditingFournisseurId] = useState(null);
  const [beneficiaires, setBeneficiaires] = useState([
    { nom: "", commission_USDT: "" },
  ]);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null); // State for selected fournisseur

  //GET ALL 
  useEffect(() => {
    axios
      .get(`${apiUrl}/all/four`)
      .then((response) => {
        setFournisseurs(response.data.fournisseurs || []);
        console.log(
          "Fournisseurs récupérés avec succès",
          response.data.fournisseurs
        );
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des fournisseurs:",
          error
        );
      });
  }, []);


  //SAVE ET MODIFIER
  const handleEnregistrer = async () => {
    if (!nomFournisseur || !tauxJour || !quantiteDisponible || !transactionId) {
      alert("Veuillez remplir tous les champs avant de continuer.");
      return;
    }

    // Vérification des bénéficiaires
    for (let i = 0; i < beneficiaires.length; i++) {
      if (!beneficiaires[i].nom.trim() || !beneficiaires[i].commission_USDT.toString().trim()) {
        alert(`Veuillez remplir tous les champs du bénéficiaire ${i + 1}.`);
        return;
      }
    }

    try {
      const fournisseurData = {
        nom: nomFournisseur,
        taux_jour: tauxJour.toString().trim(),
        quantite_USDT: quantiteDisponible.toString().trim(),
        transaction_id: transactionId.toString().trim(),
        beneficiaires: beneficiaires.map(b => ({
          nom: b.nom.trim(),
          commission_USDT: b.commission_USDT.toString().trim(),
        }))
      };

      let response;
      if (editingFournisseurId) {
        response = await axios.put(`${apiUrl}/update/four/${editingFournisseurId}`, fournisseurData);
        console.log("Fournisseur modifié avec succès", response.data.fournisseur);
        alert("Fournisseur modifié avec succès !");
        setFournisseurs(
          fournisseurs.map((fournisseur) =>
            fournisseur.id === editingFournisseurId ? response.data.fournisseur : fournisseur
          )
        );
      } else {
        response = await axios.post(`${apiUrl}/add/four`, fournisseurData);
        console.log("Fournisseur ajouté avec succès", response.data.fournisseur);
        alert("Fournisseur ajouté avec succès !");
        setFournisseurs([...fournisseurs, response.data.fournisseur]);
      }

      // Réinitialisation du formulaire
      setNomFournisseur("");
      setTauxJour("");
      setQuantiteDisponible("");
      setTransactionId("");
      setBeneficiaires([]);
      setEditingFournisseurId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du fournisseur:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };




  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?");
    if (!isConfirmed) return;

    try {
      await axios.delete(`${apiUrl}/delete/four/${id}`);
      setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== id));
      alert("Fournisseur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du fournisseur:", error);
      alert("Erreur lors de la suppression !");
    }
  };

  //Pre-remplir le formulaire pour la mofication
  const handleEdit = (fournisseur) => {
    setNomFournisseur(fournisseur.nom);
    setTauxJour(fournisseur.taux_jour.toString());
    setQuantiteDisponible(fournisseur.quantite_USDT.toString());
    setTransactionId(fournisseur.transaction_id.toString());
    setEditingFournisseurId(fournisseur.id);

    // Vérifier si le fournisseur a des bénéficiaires et les pré-remplir
    setBeneficiaires(
      fournisseur.beneficiaires && Array.isArray(fournisseur.beneficiaires)
        ? fournisseur.beneficiaires.map((b) => ({
          nom: b.nom || "",
          commission_USDT: b.commission_USDT ? b.commission_USDT.toString() : "",
        }))
        : []
    );

    console.log("Modification du fournisseur en cours:", fournisseur);
  };


  // les details 
  const handleShowDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/four/${id}`);
      setSelectedFournisseur(response.data.fournisseur);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du fournisseur:",
        error
      );
    }
  };

  const handleClosePopup = () => {
    setSelectedFournisseur(null); // Close the popup
  };

  const handleBeneficiaireChange = (index, e) => {
    const updatedBeneficiaires = [...beneficiaires];
    updatedBeneficiaires[index][e.target.name] = e.target.value;
    setBeneficiaires(updatedBeneficiaires);
  };

  const addBeneficiaire = () => {
    setBeneficiaires([...beneficiaires, { nom: "", commission_USDT: "" }]);
  };

  const removeBeneficiaire = (index) => {
    const updatedBeneficiaires = beneficiaires.filter((_, i) => i !== index);
    setBeneficiaires(updatedBeneficiaires);
  };

  // Récupérer la liste des transactions au chargement
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${apiUrl}/trans/mont`);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions:", error);
      }
    };

    fetchTransactions();
  }, []);


  return (
    <div className="container">

      {/* le formulaire d'ajout des Fournisseurs */}
      <div className="left-box">
        <h2>{editingFournisseurId ? "Modifier" : "Ajouter"} un Fournisseur</h2>
        <div className="input-group">
          <label>Nom du Fournisseur</label>
          <input
            type="text"
            value={nomFournisseur}
            onChange={(e) => setNomFournisseur(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Taux du Jour (FCFA/USDT)</label>
          <input
            type="number"
            value={tauxJour}
            onChange={(e) => setTauxJour(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Quantité Disponible (USDT)</label>
          <input
            type="number"
            value={quantiteDisponible}
            onChange={(e) => setQuantiteDisponible(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Transaction</label>
          <select
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          >
            <option value="">Sélectionner une transaction</option>
            {transactions.map((transaction) => (
              <option key={transaction.id} value={transaction.id}>
                {`Id: ${transaction.id} - Montant: ${transaction.montantFCFA} FCFA`}
              </option>
            ))}
          </select>
        </div>
        {/* Section des bénéficiaires */}
        <div className="input-group beneficiaires-row">
          <h3>Bénéficiaires</h3>
          <a className="a" onClick={addBeneficiaire}>
            ➕
          </a>
        </div>
        {beneficiaires.map((beneficiaire, index) => (
          <div key={index} className="beneficiaire-row">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={beneficiaire.nom}
              onChange={(e) => handleBeneficiaireChange(index, e)}
              required
            />
            <input
              type="number"
              name="commission_USDT"
              placeholder="Commission USDT"
              value={beneficiaire.commission_USDT}
              onChange={(e) => handleBeneficiaireChange(index, e)}
              required
            />
            {index > 0 && (
              <a
                className="b delete-icon"
                onClick={() => removeBeneficiaire(index)}
              >
                ❌
              </a>
            )}
          </div>
        ))}{" "}


        <div className="button-group">
          <button className="btn" onClick={handleEnregistrer}>
            {editingFournisseurId ? "MODIFIER" : "ENREGISTRER"}
          </button>
        </div>
      </div>

      {/* Gestion des Fournisseurs */}
      <div className="right-box">
        <h2 style={{ marginBottom: 30 }}>Gestion des Fournisseurs & Bénéficiaires</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du Fournisseur</th>
              <th>Taux du Jour</th>
              <th>Quantité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td>{fournisseur.id}</td>
                <td>{fournisseur.nom}</td>
                <td>{fournisseur.taux_jour}</td>
                <td>{fournisseur.quantite_USDT}</td>
                <td>
                  <button
                    onClick={() => handleEdit(fournisseur)}
                    className="action-btn"
                  >
                    <Edit size={20} color="blue" />
                  </button>
                  <button
                    onClick={() => handleDelete(fournisseur.id)}
                    className="action-btn"
                  >
                    <Trash2 size={20} color="red" />
                  </button>
                  <button
                    onClick={() => handleShowDetails(fournisseur.id)}
                    className="action-btn"
                  >
                    <Eye size={20} color="green" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Popup Détails */}
        {selectedFournisseur && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <div className="popup-content-header">
                <h2>Détails du fournisseur</h2>
              </div>

              <div className="popup-body">
                {/* Conteneur des détails en deux colonnes */}
                <div className="details-container">

                  {/* Colonne de gauche - Informations du fournisseur */}
                  <div className="column">
                    <h5 >Fournisseur</h5>
                    <p><strong>ID:</strong> {selectedFournisseur.id}</p>
                    <p><strong>Nom:</strong> {selectedFournisseur.nom}</p>
                    <p><strong>Taux du Jour:</strong> {selectedFournisseur.taux_jour}</p>
                    <p><strong>Quantité Disponible:</strong> {selectedFournisseur.quantite_USDT}</p>
                  </div>

                  {/* Colonne de droite - Détails de la transaction */}
                  {selectedFournisseur.transaction && (

                    <div className="column">
                      <h5>Transaction</h5>
                      <p><strong>ID Transaction:</strong> {selectedFournisseur.transaction.id}</p>
                      <p><strong>Montant (FCFA):</strong> {selectedFournisseur.transaction.montant_FCFA}</p>
                      <p><strong>Taux Convenu:</strong> {selectedFournisseur.transaction.taux_convenu}</p>
                      <p><strong>Montant (USDT):</strong> {selectedFournisseur.transaction.montant_USDT}</p>
                    </div>
                  )}
                </div>

                {/* Section des bénéficiaires */}

                <div className="beneficiaires">
                  {selectedFournisseur.beneficiaires.map((beneficiaire) => (
                    <div key={beneficiaire.id} className="beneficiaire">
                      <h5>Bénéficiaire</h5>
                      <p><strong>ID:</strong> {beneficiaire.id}</p>
                      <p><strong>Nom:</strong> {beneficiaire.nom}</p>
                      <p><strong>Commission (USDT):</strong> {beneficiaire.commission_USDT}</p>
                    </div>
                  ))}
                </div>

                {/* Bouton de fermeture */}
                <button className="close-btn" onClick={handleClosePopup}>
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

export default Fournisseurs;
