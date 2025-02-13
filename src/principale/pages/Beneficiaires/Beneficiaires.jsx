import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Beneficiaires.css";
import { Trash2, Edit } from "lucide-react";

const apiUrl = "http://127.0.0.1:5000";

const Beneficiaires = () => {
  const [nom, setNom] = useState("");
  const [commissionUSDT, setCommissionUSDT] = useState("");
  const [fournisseurId, setFournisseurId] = useState("");
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [editingBeneficiaireId, setEditingBeneficiaireId] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/beneficiaires/all`)
      .then((response) => {
        setBeneficiaires(response.data.beneficiaires || []);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des bénéficiaires:", error);
      });
  }, []);

  const addBeneficiaire = () => {
    setBeneficiaires([
      ...beneficiaires,
      { nom: "", commission_USDT: "", fournisseur_id: "" },
    ]);
  };

  const handleBeneficiaireChange = (index, e) => {
    const updatedBeneficiaires = [...beneficiaires];
    updatedBeneficiaires[index][e.target.name] = e.target.value;
    setBeneficiaires(updatedBeneficiaires);
  };

  const removeBeneficiaire = (index) => {
    const updatedBeneficiaires = [...beneficiaires];
    updatedBeneficiaires.splice(index, 1);
    setBeneficiaires(updatedBeneficiaires);
  };

  const handleEnregistrer = async () => {
    if (!nom || !commissionUSDT || !fournisseurId) return;
    try {
      if (editingBeneficiaireId) {
        const response = await axios.put(`${apiUrl}/beneficiaires/update/${editingBeneficiaireId}`, {
          nom,
          commission_USDT: commissionUSDT,
          fournisseur_id: fournisseurId,
        });
        setBeneficiaires(
          beneficiaires.map((b) => (b.id === editingBeneficiaireId ? response.data.beneficiaire : b))
        );
      } else {
        const response = await axios.post(`${apiUrl}/beneficiaires/add`, {
          nom,
          commission_USDT: commissionUSDT,
          fournisseur_id: fournisseurId,
        });
        setBeneficiaires([...beneficiaires, response.data.beneficiaire]);
      }
      setNom("");
      setCommissionUSDT("");
      setFournisseurId("");
      setEditingBeneficiaireId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du bénéficiaire:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/beneficiaires/delete/${id}`);
      setBeneficiaires(beneficiaires.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du bénéficiaire:", error);
    }
  };

  const handleEdit = (beneficiaire) => {
    setNom(beneficiaire.nom);
    setCommissionUSDT(beneficiaire.commission_USDT);
    setFournisseurId(beneficiaire.fournisseur_id);
    setEditingBeneficiaireId(beneficiaire.id);
  };

  return (
    <div className="container">
      <div className="left-box">
        <h2>{editingBeneficiaireId ? "Modifier" : "Ajouter"} un Bénéficiaire</h2>
        <div className="input-group">
          <label>Nom</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Commission (USDT)</label>
          <input type="number" value={commissionUSDT} onChange={(e) => setCommissionUSDT(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>ID Fournisseur</label>
          <input type="number" value={fournisseurId} onChange={(e) => setFournisseurId(e.target.value)} required />
        </div>
        
        {/* Section des bénéficiaires */}
        <div className="input-group beneficiaires-row">
          <h3>Bénéficiaires</h3>
          <a className="a" onClick={addBeneficiaire}>
            ➕ Ajouter un bénéficiaire
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
              <a className="b delete-icon" onClick={() => removeBeneficiaire(index)}>
                ❌
              </a>
            )}
          </div>
        ))}
        
        <div className="button-group">
          <button className="btn" onClick={handleEnregistrer}>
            {editingBeneficiaireId ? "MODIFIER" : "ENREGISTRER"}
          </button>
        </div>
      </div>

      <div className="right-box">
        <h2>Liste des Bénéficiaires</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Commission (USDT)</th>
              <th>ID Fournisseur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaires.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.nom}</td>
                <td>{b.commission_USDT}</td>
                <td>{b.fournisseur_id}</td>
                <td>
                  <button onClick={() => handleEdit(b)} className="action-btn">
                    <Edit size={20} color="blue" />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="action-btn">
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

export default Beneficiaires;
