import React, {useState, useEffect} from "react";
import axios from "axios";
import { Trash2, Edit, Eye } from "lucide-react";
import "./Beneficiaires.css";

const apiUrl = "http://127.0.0.1:5000";

const Beneficiaires = () => {
    const [nom, setNom] = useState("");
    const [commissionUSDT, setCommissionUSDT] = useState("");
    const [fournisseurNom, setFournisseurNom] = useState("");
    const [fournisseurs, setFournisseurs] = useState([]);
    const [beneficiaires, setBeneficiaires] = useState([]);
    const [editingBeneficiaireId, setEditingBeneficiaireId] = useState(null);
    const [selectedBeneficiaire, setSelectedBeneficiaire] = useState(null);

    // Charger les bénéficiaires
    useEffect(() => {
        axios
            .get(`${apiUrl}/all/four`)
            .then((response) => {
                const allFournisseurs = response.data.fournisseurs || [];
                const allBeneficiaires = allFournisseurs.flatMap(f => f.beneficiaires);
                setBeneficiaires(allBeneficiaires);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des bénéficiaires:", error);
            });
    }, []);

    // Charger la liste des fournisseurs
    useEffect(() => {
        axios
            .get(`${apiUrl}/all/four/nom`)
            .then((response) => {
                const nomsFournisseurs = response.data.fournisseurs.map(f => f.nom);
                setFournisseurs(nomsFournisseurs);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des fournisseurs:", error);
            });
    }, []);

    const handleEnregistrer = async () => {
        if (!nom || !commissionUSDT || !fournisseurNom) return;
        try {
            if (editingBeneficiaireId) {
                const response = await axios.put(`${apiUrl}/update/benef/${editingBeneficiaireId}`, {
                    nom,
                    commission_USDT: commissionUSDT,
                    fournisseur_nom: fournisseurNom,
                });
                setBeneficiaires(
                    beneficiaires.map((b) => (b.id === editingBeneficiaireId ? response.data.beneficiaire : b))
                );
            } else {
                const response = await axios.post(`${apiUrl}/add/benef`, {
                    nom,
                    commission_USDT: commissionUSDT,
                    fournisseur_nom: fournisseurNom,
                });
                setBeneficiaires([...beneficiaires, response.data.beneficiaire]);
            }
            setNom("");
            setCommissionUSDT("");
            setFournisseurNom("");
            setEditingBeneficiaireId(null);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du bénéficiaire:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/delete/benef/${id}`);
            setBeneficiaires(beneficiaires.filter((b) => b.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression du bénéficiaire:", error);
        }
    };

    const handleEdit = (beneficiaire) => {
        setNom(beneficiaire.nom);
        setCommissionUSDT(beneficiaire.commission_USDT);
        setFournisseurNom(beneficiaire.fournisseur_nom);
        setEditingBeneficiaireId(beneficiaire.id);
    };

    // Afficher les détails d'un bénéficiaire
    const handleShowDetails = async (id) => {
        try {
            const response = await axios.get(`${apiUrl}/benef/${id}`);
            setSelectedBeneficiaire(response.data.beneficiaire);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du bénéficiaire:", error);
        }
    };

    const handleClosePopup = () => {
        setSelectedBeneficiaire(null);
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
                    <label>Fournisseur</label>
                    <select value={fournisseurNom} onChange={(e) => setFournisseurNom(e.target.value)} required>
                        <option value="">Sélectionnez un fournisseur</option>
                        {fournisseurs.map((nom, index) => (
                            <option key={index} value={nom}>
                                {nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="button-group">
                    <button className="btn" onClick={handleEnregistrer}>
                        {editingBeneficiaireId ? "MODIFIER" : "ENREGISTRER"}
                    </button>
                </div>
            </div>

            <div className="right-box">
                <h2 style={{ marginBottom: 30 }}>Liste des Bénéficiaires
                    
                </h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom du Bénéficiaire</th>
                        <th>Commission (USDT)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {beneficiaires.map((b) => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.nom}</td>
                            <td>{b.commission_USDT}</td>
                            <td>
                                <button onClick={() => handleEdit(b)} className="action-btn">
                                    <Edit size={20} color="blue" />
                                </button>
                                <button onClick={() => handleDelete(b.id)} className="action-btn">
                                    <Trash2 size={20} color="red" />
                                </button>
                                <button onClick={() => handleShowDetails(b.id)} className="action-btn">
                                    <Eye size={20} color="green" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {selectedBeneficiaire && (
                    <div className="popup-overlay" onClick={handleClosePopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <div className="popup-content-header">
                                <h2>Détails du Bénéficiaire</h2>
                            </div>
                            <div className="popup-body">
                                <p><strong>ID:</strong> {selectedBeneficiaire.id}</p>
                                <p><strong>Nom:</strong> {selectedBeneficiaire.nom}</p>
                                <p><strong>Commission (USDT):</strong> {selectedBeneficiaire.commission_USDT}</p>

                                <h3>Fournisseur Associé</h3>
                                {selectedBeneficiaire.fournisseur ? (
                                    <>
                                        <p><strong>ID Fournisseur:</strong> {selectedBeneficiaire.fournisseur.id}</p>
                                        <p><strong>Nom Fournisseur:</strong> {selectedBeneficiaire.fournisseur.nom}</p>
                                        <p><strong>Quantité USDT Disponible:</strong> {selectedBeneficiaire.fournisseur.quantite_USDT}</p>
                                        <p><strong>Taux du Jour:</strong> {selectedBeneficiaire.fournisseur.taux_jour}</p>
                                    </>
                                ) : (
                                    <p>Aucun fournisseur associé.</p>
                                )}

                                <button className="close-btn" onClick={handleClosePopup}>Fermer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Beneficiaires;
