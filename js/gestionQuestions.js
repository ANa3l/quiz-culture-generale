let indexQuestionActuelle = 0;
let erreurs = 0;
let timer;       // Stocke l'intervalle du timer
let tempsRestant; // Temps restant pour la question en cours

// 🔴 Définir un temps par défaut pour chaque question (10 secondes ici)
let parametres = { temps: 10 };

// Fonction pour afficher le timer dans la page
function afficherTimer() {
    let timerElement = document.getElementById("timer");
    if (!timerElement) {
      timerElement = document.createElement("p");
      timerElement.id = "timer";
      // Insère le timer en haut du conteneur de la question
      document.getElementById("conteneur-question").prepend(timerElement);
    }
    timerElement.textContent = `Temps restant : ${tempsRestant}s`;
}

// Fonction pour décrémenter le timer et passer à la question suivante en cas d'expiration
function decrementerTimer() {
    tempsRestant--;
    afficherTimer();
    if (tempsRestant <= 0) {
      clearInterval(timer);
      // Considère l'absence de réponse comme une erreur
      erreurs++;
      indexQuestionActuelle++;
      afficherQuestion();
    }
}

// 🔴 Initialisation du timer déplacée dans `afficherQuestion()`
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

    // 🔴 Initialisation du timer à chaque affichage de question
    clearInterval(timer);
    tempsRestant = parametres.temps;
    afficherTimer();
    timer = setInterval(decrementerTimer, 1000);
}

// Fonction pour activer le bouton valider lorsqu'une réponse est sélectionnée
function activerBoutonValider() {
    document.getElementById("bouton-valider").disabled = false;
}

// Fonction pour passer à la question suivante
function questionSuivante() {
    // Arrête le timer de la question en cours
    clearInterval(timer);

    // Vérifier si une réponse a été sélectionnée
    const reponseSelectionnee = document.querySelector('input[name="reponse"]:checked');
    if (!reponseSelectionnee) return;

    indexQuestionActuelle++;
    afficherQuestion();
}

// Rendre les fonctions accessibles dans `main.js`
window.afficherQuestion = afficherQuestion;
window.questionSuivante = questionSuivante;
