function calculerBenefice() {
    const tauxConvenu = parseFloat(document.getElementById('taux-convenu').value);
    const tauxFournisseur = parseFloat(document.getElementById('taux-fournisseur').value);
    const quantiteUSDT = parseFloat(document.getElementById('quantite-usdt').value);

    if (isNaN(tauxConvenu) || isNaN(tauxFournisseur) || isNaN(quantiteUSDT)) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const beneficeParUSDT = tauxConvenu - tauxFournisseur;
    const beneficeTotal = beneficeParUSDT * quantiteUSDT;

    document.getElementById('benefice-usdt').innerText = `Bénéfice par USDT : ${beneficeParUSDT} FCFA`;
    document.getElementById('benefice-total').innerText = `Bénéfice Total : ${beneficeTotal} FCFA`;
}
