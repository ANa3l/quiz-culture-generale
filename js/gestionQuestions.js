let indexQuestionActuelle = 0;

// Fonction pour afficher la question actuelle
function afficherQuestion() {
    if (indexQuestionActuelle >= window.questions.length) {
        document.getElementById("conteneur-question").innerHTML = "<h2>Fin du quiz ! 🎉</h2>";
        return;
    }

    const questionActuelle = window.questions[indexQuestionActuelle];

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

    document.getElementById("bouton-valider").disabled = true;
}

// Fonction pour sélectionner une réponse
function selectionnerReponse(index) {
    document.querySelectorAll(".bouton-reponse").forEach(btn => btn.classList.remove("selectionnee"));
    document.querySelectorAll(".bouton-reponse")[index].classList.add("selectionnee");

    document.getElementById("bouton-valider").disabled = false;
}

// Fonction pour passer à la question suivante
function questionSuivante() {
    indexQuestionActuelle++;
    afficherQuestion();
}

// Rendre les fonctions accessibles dans `main.js`
window.afficherQuestion = afficherQuestion;
window.questionSuivante = questionSuivante;
