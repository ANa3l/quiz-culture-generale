let indexQuestionActuelle = 0;

// Fonction pour afficher la question actuelle avec des boutons radio
function afficherQuestion() {
    if (indexQuestionActuelle >= window.questions.length) {
        document.getElementById("conteneur-question").innerHTML = "<h2>Fin du quiz ! 🎉</h2>";
        return;
    }

    const questionActuelle = window.questions[indexQuestionActuelle];

    document.getElementById("texte-question").textContent = questionActuelle.texte;

    const conteneurReponses = document.getElementById("conteneur-reponses");
    conteneurReponses.innerHTML = "";

    // Créer un groupe de boutons radio pour les réponses
    questionActuelle.reponses.forEach((reponse, index) => {
        const divOption = document.createElement("div");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "reponse";
        input.value = index;
        input.id = "reponse" + index;
        input.addEventListener("change", () => activerBoutonValider());

        const label = document.createElement("label");
        label.htmlFor = "reponse" + index;
        label.textContent = reponse;

        divOption.appendChild(input);
        divOption.appendChild(label);
        conteneurReponses.appendChild(divOption);
    });

    document.getElementById("bouton-valider").disabled = true;
}

// Fonction pour activer le bouton valider lorsqu'une réponse est sélectionnée
function activerBoutonValider() {
    document.getElementById("bouton-valider").disabled = false;
}

// Fonction pour passer à la question suivante
function questionSuivante() {
    // Vérifier si une réponse a été sélectionnée
    const reponseSelectionnee = document.querySelector('input[name="reponse"]:checked');
    if (!reponseSelectionnee) return;

    indexQuestionActuelle++;
    afficherQuestion();
}

// Rendre les fonctions accessibles dans `main.js`
window.afficherQuestion = afficherQuestion;
window.questionSuivante = questionSuivante;
