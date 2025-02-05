import "./Fournisseurs.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";

const apiUrl = "http://127.0.0.1:5000";

const Fournisseurs = () => {
  const [nomFournisseur, setNomFournisseur] = useState("");
  const [tauxJour, setTauxJour] = useState("");
  const [quantiteDisponible, setQuantiteDisponible] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [fournisseurs, setFournisseurs] = useState([]);
  const [editingFournisseurId, setEditingFournisseurId] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/all/four`)
      .then((response) => {
        setFournisseurs(response.data.fournisseurs || []);
        console.log("Fournisseurs récupérés avec succès :", response.data.fournisseurs);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des fournisseurs:", error);
      });
  }, []);

  const handleEnregistrer = async () => {
    if (!nomFournisseur || !tauxJour || !quantiteDisponible || !transactionId) {
      alert("Veuillez remplir tous les champs avant d'enregistrer.");
      console.warn("Tentative d'enregistrement avec des champs vides.");
      return;
    }

    try {
      if (editingFournisseurId) {
        const response = await axios.put(`${apiUrl}/update/four/${editingFournisseurId}`, {
          nom: nomFournisseur,
          taux_jour: tauxJour,
          quantite_USDT: quantiteDisponible,
          transaction_id: transactionId,
        });
        console.log("Fournisseur modifié avec succès :", response.data.fournisseur);
        setFournisseurs(
          fournisseurs.map((fournisseur) =>
            fournisseur.id === editingFournisseurId ? response.data.fournisseur : fournisseur
          )
        );
      } else {
        const response = await axios.post(`${apiUrl}/add/four`, {
          nom: nomFournisseur,
          taux_jour: tauxJour,
          quantite_USDT: quantiteDisponible,
          transaction_id: transactionId,
        });
        alert("Fournisseur ajouté avec succès !");
        console.log("Fournisseur ajouté :", response.data.fournisseur);
        setFournisseurs([...fournisseurs, response.data.fournisseur]);
      }

      setNomFournisseur("");
      setTauxJour("");
      setQuantiteDisponible("");
      setTransactionId("");
      setEditingFournisseurId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du fournisseur:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/fournisseurs/delete/${id}`);
      setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== id));
      console.log("Fournisseur supprimé avec succès, ID:", id);
    } catch (error) {
      console.error("Erreur lors de la suppression du fournisseur:", error);
    }
  };

  const handleEdit = (fournisseur) => {
    setNomFournisseur(fournisseur.nom);
    setTauxJour(fournisseur.taux_jour);
    setQuantiteDisponible(fournisseur.quantite_USDT);
    setTransactionId(fournisseur.transaction_id);
    setEditingFournisseurId(fournisseur.id);
    console.log("Modification du fournisseur ID:", fournisseur.id);
  };

  return (
    <div className="container">
      <div className="left-box">
        <h2>{editingFournisseurId ? "Modifier" : "Ajouter"} un Fournisseur</h2>
        <div className="input-group">
          <label>Nom du Fournisseur</label>
          <input type="text" value={nomFournisseur} onChange={(e) => setNomFournisseur(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Taux du Jour (FCFA/USDT)</label>
          <input type="number" value={tauxJour} onChange={(e) => setTauxJour(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Quantité Disponible (USDT)</label>
          <input type="number" value={quantiteDisponible} onChange={(e) => setQuantiteDisponible(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>ID de Transaction</label>
          <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required />
        </div>
        <div className="button-group">
          <button className="btn" onClick={handleEnregistrer}>
            {editingFournisseurId ? "MODIFIER" : "ENREGISTRER"}
          </button>
        </div>
      </div>

      <div className="right-box">
        <h2>Gestion des Fournisseurs</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du Fournisseur</th>
              <th>Taux du Jour</th>
              <th>Quantité Disponible</th>
              <th>ID Transaction</th>
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
                <td>{fournisseur.transaction_id}</td>
                <td>
                  <button onClick={() => handleEdit(fournisseur)} className="action-btn">
                    <Edit size={20} color="blue" />
                  </button>
                  <button onClick={() => handleDelete(fournisseur.id)} className="action-btn">
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

export default Fournisseurs;
