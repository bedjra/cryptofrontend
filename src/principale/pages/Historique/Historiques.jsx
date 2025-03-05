import React from "react";
import "./Historiques.css";
import { useEffect, useState } from "react";

const Historique = () => {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/cal/all")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des transactions:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Taux Convenu</th>
              <th className="border p-2">Fournisseurs</th>
              <th className="border p-2">Bénéficiaires</th>
              <th className="border p-2">Bénéfice Total Fournisseurs</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id} className="border">
                <td className="border p-2 text-center">{transaction.transaction_id}</td>
                <td className="border p-2 text-center">{transaction.taux_convenu}</td>
                <td className="border p-2">
                  <ul>
                    {transaction.benefices_fournisseurs.map((f, index) => (
                      <li key={index} className="text-sm">
                        {f.fournisseur}: {f.benefice_total_FCFA} FCFA
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2">
                  <ul>
                    {transaction.repartition_beneficiaires.map((b, index) => (
                      <li key={index} className="text-sm">
                        {b.beneficiaire}: {b.benefice_FCFA} FCFA
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border p-2 text-center">
                  {transaction.resume_global.benefice_total_fournisseurs} FCFA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


export default Historique;
