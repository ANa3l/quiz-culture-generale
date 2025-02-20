document.addEventListener("DOMContentLoaded", () => {
    afficherQuestion();
    document.getElementById("bouton-valider").addEventListener("click", questionSuivante);

    document.getElementById("bouton-mystere").addEventListener("click", effetMystere);
});
