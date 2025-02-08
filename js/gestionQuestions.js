// Déclaration des variables globales
let listeQuestions = [];
let indexQuestionActuelle = 0;

// Fonction pour charger les questions depuis le fichier JSON
export function chargerQuestions() {
    fetch('../data/questions.json')
        .then(response => response.json())
        .then(data => {
            listeQuestions = data;
            afficherQuestion();
        })
        .catch(error => console.error("Erreur lors du chargement des questions :", error));
}

// Fonction pour afficher la question actuelle
export function afficherQuestion() {
    if (indexQuestionActuelle >= listeQuestions.length) {
        document.getElementById("conteneur-question").innerHTML = "<h2>Fin du quiz ! 🎉</h2>";
        return;
    }

    const questionActuelle = listeQuestions[indexQuestionActuelle];

    document.getElementById("texte-question").textContent = questionActuelle.texte;

    const conteneurReponses = document.getElementById("conteneur-reponses");
    conteneurReponses.innerHTML = "";

    questionActuelle.reponses.forEach((reponse, index) => {
        const boutonReponse = document.createElement("button");
        boutonReponse.textContent = reponse;
        boutonReponse.classList.add("bouton-reponse");
        boutonReponse.onclick = () => selectionnerReponse(index);
        conteneurReponses.appendChild(boutonReponse);
    });

    document.getElementById("bouton-valider").disabled = true; // Désactiver tant qu'aucune réponse n'est choisie
}