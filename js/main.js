document.addEventListener("DOMContentLoaded", () => {
    // Réinitialiser le quiz au chargement de la page
    initialiserQuiz();

    // Attacher l'événement au bouton "Valider" une seule fois
    document.getElementById("bouton-valider").addEventListener("click", questionSuivante);

    document.getElementById("bouton-mystere").addEventListener("click", effetMystere);
});

// 🔹 Écouteur global pour détecter les clics sur "Rejouer", même s'il est ajouté dynamiquement
document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "rejouer-btn") {
        rejouerQuiz();
    }
});