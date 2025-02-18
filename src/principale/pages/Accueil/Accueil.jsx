import React, { useEffect, useState } from "react";
import "./Accueil.css";
import { DollarSign, CreditCard, Truck, Users } from "lucide-react";
import {FaExchangeAlt} from "react-icons/fa";

const Accueil = () => {
  // États pour stocker les données du backend
  const [totalBenefices, setTotalBenefices] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [fournisseursActifs, setFournisseursActifs] = useState(0);
  const [totalBeneficiaires, setTotalBeneficiaires] = useState(0);

  // Fonction pour récupérer les données
  useEffect(() => {
    fetch("http://localhost:5000/total/been")
        .then((res) => res.json())
        .then((data) => setTotalBenefices(data.total_benefices || 0))
        .catch((err) => console.error("Erreur récupération bénéfices :", err));

    fetch("http://localhost:5000/total/tr")
        .then((res) => res.json())
        .then((data) => setTotalTransactions(data.total || 0))
        .catch((err) => console.error("Erreur récupération transactions :", err));

    fetch("http://localhost:5000/total/fr")
        .then((res) => res.json())
        .then((data) => setFournisseursActifs(data.total_fournisseurs || 0))
        .catch((err) => console.error("Erreur récupération fournisseurs :", err));

    fetch("http://localhost:5000/total/bn")
        .then((res) => res.json())
        .then((data) => setTotalBeneficiaires(data.total_beneficiaires || 0))
        .catch((err) => console.error("Erreur récupération bénéficiaires :", err));
  }, []);

  return (
      <main className="dashboard">
        {/* Section Résumé Global */}
        <section className="summary grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <DollarSign className="icon text-green-500" />

            <div>
              <h3 className="text-lg font-semibold">Total Bénéfices (FCFA)</h3>
              <p className="text-xl font-bold">{totalBenefices.toLocaleString()}</p>
            </div>
          </div>

          <div className="card">
            <FaExchangeAlt className="icon text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Transactions</h3>
              <p className="text-xl font-bold">{totalTransactions}</p>
            </div>
          </div>

          <div className="card">
            <Truck className="icon text-orange-500" />
            <div>
              <h3 className="text-lg font-semibold">Fournisseurs Actifs</h3>
              <p className="text-xl font-bold">{fournisseursActifs}</p>
            </div>
          </div>

          <div className="card">
            <Users className="icon text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Bénéficiaires</h3>
              <p className="text-xl font-bold">{totalBeneficiaires}</p>
            </div>
          </div>
        </section>



          {/* Section Transactions Récentes
      <section className="recent-transactions">
        <h2>Transactions Récentes</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Montant (FCFA)</th>
              <th>Montant (USDT)</th>
              <th>Fournisseur</th>
              <th>Bénéfices (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-01-28</td>
              <td>500,000</td>
              <td>730.50</td>
              <td>Fournisseur A</td>
              <td>15,000</td>
            </tr>
            <tr>
              <td>2025-01-27</td>
              <td>300,000</td>
              <td>438.50</td>
              <td>Fournisseur B</td>
              <td>12,000</td>
            </tr>
            <tr>
              <td>2025-01-26</td>
              <td>1,200,000</td>
              <td>1,752.00</td>
              <td>Fournisseur C</td>
              <td>40,000</td>
            </tr>
          </tbody>
        </table>
      </section>
      */}

      </main>
  );
};

export default Accueil;







