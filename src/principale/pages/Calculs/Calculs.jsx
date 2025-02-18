import React, { useState } from 'react';
import "./Calculs.css";

const Calculs = () => {
  const [montantFCFA, setMontantFCFA] = useState('');
  const [tauxConvenu, setTauxConvenu] = useState('');
  const [tauxFournisseur, setTauxFournisseur] = useState('');
  const [quantiteUSDT, setQuantiteUSDT] = useState('');
  const [commission, setCommission] = useState('');
  const [resultats, setResultats] = useState(null);

  const handleCalculer = async () => {
    const response = await fetch('http://127.0.0.1:5000/calculer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        montantFCFA: Number(montantFCFA),
        tauxConvenu: Number(tauxConvenu),
        tauxFournisseur: Number(tauxFournisseur),
        quantiteUSDT: Number(quantiteUSDT),
        commission: Number(commission)
      })
    });
    const data = await response.json();
    setResultats(data);
  };

  return (
    <div className="container">
      <div className="left-box">
        <h3>CALCUL EN TEMPS REEL</h3>

        <div className="input-group">
          <label htmlFor="montantFCFA">Montant à retirer (FCFA)</label>
          <input 
            type="number" 
            id="montantFCFA"
            value={montantFCFA} 
            onChange={(e) => setMontantFCFA(e.target.value)} 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="tauxConvenu">Taux convenu</label>
          <input 
            type="number" 
            id="tauxConvenu"
            value={tauxConvenu} 
            onChange={(e) => setTauxConvenu(e.target.value)} 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="tauxFournisseur">Taux du fournisseur</label>
          <input 
            type="number" 
            id="tauxFournisseur"
            value={tauxFournisseur} 
            onChange={(e) => setTauxFournisseur(e.target.value)} 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="quantiteUSDT">Quantité disponible en USDT</label>
          <input 
            type="number" 
            id="quantiteUSDT"
            value={quantiteUSDT} 
            onChange={(e) => setQuantiteUSDT(e.target.value)} 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="commission">Commission par USDT</label>
          <input 
            type="number" 
            id="commission"
            value={commission} 
            onChange={(e) => setCommission(e.target.value)} 
            className="w-full p-2 border rounded-lg" 
            required 
          />
        </div>

        <div className="button-group">
          <button className="btn" onClick={handleCalculer}>
            CALCULER
          </button>
        </div>
      </div>

      <div className="right-box">
        <h2>RESULTATS DU CALCUL</h2>
        {resultats && (
          <div className="resultats">
            <p><strong>Montant en USDT :</strong> {resultats.montantUSDT} USDT</p>
            <p><strong>Bénéfice par USDT :</strong> {resultats.beneficeUSDT} FCFA</p>
            <p><strong>Bénéfice total (FCFA) :</strong> {resultats.beneficeTotalFCFA} FCFA</p>
            <p><strong>Bénéfice bénéficiaire :</strong> {resultats.beneficeBeneficiaire} FCFA</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculs;
