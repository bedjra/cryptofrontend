import "./Four.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = "http://127.0.0.1:5000";

const Four = () => {
  const [fournisseurs, setFournisseurs] = useState([]);

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

  return (

    
    <div className="histo">



      <div className="rightbox">
        <h2 style={{ marginBottom: 25 }}>Liste des Fournisseurs</h2>
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
              </tr>
            ))}
          </tbody>



        </table>
      </div>
    </div>
  );
};

export default Four;
