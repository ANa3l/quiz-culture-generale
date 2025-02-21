document.addEventListener("DOMContentLoaded", () => {
    // Réinitialiser le quiz au chargement de la page
    initialiserQuiz();

    // Attacher l'événement au bouton "Valider" une seule fois
    document.getElementById("bouton-valider").addEventListener("click", questionSuivante);
});
