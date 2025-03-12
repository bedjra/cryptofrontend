import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, Creditcar, Truck, Users } from "lucide-react";
import { FaExchangeAlt } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Importer le style
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const apiUrl = "http://127.0.0.1:5000";

const Accueil = () => {
  const [totalBenefices, setTotalBenefices] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fournisseursActifs, setFournisseursActifs] = useState(0);
  const [totalBeneficiaires, setTotalBeneficiaires] = useState(0);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [beneficiaires, setBeneficiaires] = useState([]);
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    fetch(`${apiUrl}/total/been`)
      .then((res) => res.json())
      .then((data) => setTotalBenefices(data.benefice_global_total || 0)) // Correction ici
      .catch((err) => console.error("Erreur récupération bénéfices :", err));

    fetch(`${apiUrl}/total/tr`)
      .then((res) => res.json())
      .then((data) => setTotalTransactions(data.total || 0))
      .catch((err) => console.error("Erreur récupération transactions :", err));

    fetch(`${apiUrl}/total/fr`)
      .then((res) => res.json())
      .then((data) => setFournisseursActifs(data.total_fournisseurs || 0))
      .catch((err) => console.error("Erreur récupération fournisseurs :", err));

    fetch(`${apiUrl}/total/bn`)
      .then((res) => res.json())
      .then((data) => setTotalBeneficiaires(data.total_beneficiaires || 0))
      .catch((err) => console.error("Erreur récupération bénéficiaires :", err));

    fetch(`${apiUrl}/four/taux`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des taux");
        }
        return response.json();
      })
      .then((data) => {
        setFournisseurs(data.fournisseurs);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des taux");
        setLoading(false);
      });

    fetch(`${apiUrl}/benef/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des bénéficiaires");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données bénéficiaires :", data); // ✅ Debug
        setBeneficiaires(Array.isArray(data.beneficiaires) ? data.beneficiaires : []);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

    fetch("http://localhost:5000/acc/last")
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions))
      .catch((err) => console.error("Erreur lors de la récupération :", err));


  }, []);

  return (
    <main >

      <div className="accueil">

      </div>






    </main>
  );
};

export default Accueil;
