import "./Four.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, DollarSign, Eye } from "lucide-react";

const apiUrl = "http://127.0.0.1:5000";

const Four = () => {
  const [fournisseurs, setFournisseurs] = useState([]);

  const [nomFournisseur, setNomFournisseur] = useState("");
  const [tauxJour, setTauxJour] = useState("");
  const [quantiteDisponible, setQuantiteDisponible] = useState("");
  const [editingFournisseurId, setEditingFournisseurId] = useState(null);
  const [beneficiaires, setBeneficiaires] = useState([
    { nom: "", commission_USDT: "" },
  ]);

  const [selectedFournisseur, setSelectedFournisseur] = useState(null); // State for selected fournisseur

  // Récupérer tous les fournisseurs
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


  //SAVE ET MODIFIER
  const handleEnregistrer = async () => {
    if (!nomFournisseur || !tauxJour || !quantiteDisponible) {
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
        beneficiaires: beneficiaires.map(b => ({
          nom: b.nom.trim(),
          commission_USDT: b.commission_USDT.toString().trim(),
        }))
      };

      let response;
      if (editingFournisseurId) {
        response = await axios.put(`${apiUrl}/update/fourn/${editingFournisseurId}`, fournisseurData);
        console.log("Fournisseur modifié avec succès", response.data.fournisseur);
        alert("Fournisseur modifié avec succès !");
        setFournisseurs(
          fournisseurs.map((fournisseur) =>
            fournisseur.id === editingFournisseurId ? response.data.fournisseur : fournisseur
          )
        );
      } else {
        response = await axios.post(`${apiUrl}/add/fourn`, fournisseurData);
        console.log("Fournisseur ajouté avec succès", response.data.fournisseur);
        alert("Fournisseur ajouté avec succès !");
        setFournisseurs([...fournisseurs, response.data.fournisseur]);
      }

      // Réinitialisation du formulaire
      setNomFournisseur("");
      setTauxJour("");
      setQuantiteDisponible("");
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
      await axios.delete(`${apiUrl}/delete/fourn/${id}`);
      setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== id));
      alert("Fournisseur supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du fournisseur:", error);
      alert("Erreur lors de la suppression !");
    }
  };

  //Pre-remplir le formulaire pour la mofication
  const handleEdit = (fournisseur) => {
    if (!fournisseur) return;
  
    setNomFournisseur(fournisseur.nom || "");
    setTauxJour(fournisseur.taux_jour ? fournisseur.taux_jour.toString() : "");
    setQuantiteDisponible(fournisseur.quantite_USDT ? fournisseur.quantite_USDT.toString() : "");
    setEditingFournisseurId(fournisseur.id || null);
  
    // Vérifier et pré-remplir les bénéficiaires
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



  return (


    <div className="container">

      <div className="left-box">
        <h4>{editingFournisseurId ? "Modifier" : "Ajouter"} un Fournisseur</h4>
        <div className="input-group">
          <span>Nom du Fournisseur</span>
          <input
            type="text"
            value={nomFournisseur}
            onChange={(e) => setNomFournisseur(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <span>Taux du Jour (FCFA/USDT)</span>
          <input
            type="number"
            value={tauxJour}
            onChange={(e) => setTauxJour(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <span>Quantité Disponible (USDT)</span>
          <input
            type="number"
            value={quantiteDisponible}
            onChange={(e) => setQuantiteDisponible(e.target.value)}
            required />
        </div>

        <div className="input-group beneficiaires-row">
          <p>Bénéficiaires</p>
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
              placeholder=" USDT"
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



        <div className="but">
          <button className="save" onClick={handleEnregistrer}>
            {editingFournisseurId ? "Modifier" : "Enregistrer"}
          </button>
        </div>

      </div>




      <div className="right-box">
        <h2 style={{ marginBottom: 25 }}> Liste des Fournisseurs</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Taux</th>
              <th>Quantité</th>
              <th>Bénéficiaires</th>
              <th>Com_USDT</th>

            </tr>
          </thead>

          <tbody>
            {fournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td>{fournisseur.id}</td>
                <td>{fournisseur.nom}</td>
                <td>{fournisseur.taux_jour}</td>
                <td>{fournisseur.quantite_USDT}</td>

                {/* Affichage des bénéficiaires sur une ligne séparée */}
                <td>
                  {fournisseur.beneficiaires && fournisseur.beneficiaires.length > 0 ? (
                    fournisseur.beneficiaires.map((beneficiaire) => (
                      <div key={beneficiaire.id}>
                        {beneficiaire.nom}
                      </div>
                    ))
                  ) : (
                    "Aucun bénéficiaire"
                  )}
                </td>

                {/* Affichage des commissions des bénéficiaires */}
                <td>
                  {fournisseur.beneficiaires && fournisseur.beneficiaires.length > 0 ? (
                    fournisseur.beneficiaires.map((beneficiaire) => (
                      <div key={beneficiaire.id}>
                        {beneficiaire.commission_USDT}
                      </div>
                    ))
                  ) : (
                    "Aucun bénéficiaire"
                  )}
                </td>

                <td>
      {/*
                  <button onClick={() => handleEdit(fournisseur)} className="action-btn">
                    <Edit size={20} color="blue" />
                  </button>


                  <button onClick={() => handleDelete(fournisseurs.id)} className="action-btn">
                    <Trash2 size={20} color="red" />
                  </button>
             
                
                  <button
                    onClick={() => handleShowDetails(fournisseurs.id)}
                    className="action-btn"
                  >
                    <Eye size={21} color="green" />
                  </button>
                  */}
                </td>
              </tr>
            ))}
          </tbody>



        </table>
      </div>
    </div>
  );
};

export default Four;
