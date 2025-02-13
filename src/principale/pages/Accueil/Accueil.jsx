import React from 'react';
import './Accueil.css';

const Accueil = () => {
  return (
    <main className="dashboard">
     

      {/* Section Résumé Global */}
      <section className="summary">
        <div className="card">
          <h3>Total Bénéfices (FCFA)</h3>
          <p>5,250,000</p>
        </div>
        <div className="card">
          <h3>Total Transactions</h3>
          <p>38</p>
        </div>
        <div className="card">
          <h3>Fournisseurs Actifs</h3>
          <p>12</p>
        </div>
        <div className="card">
          <h3>Bénéficiaires</h3>
          <p>20</p>
        </div>
      </section>

      {/* Section Transactions Récentes */}
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
    </main>
  );
};


export default Accueil;
