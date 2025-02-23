let indexQuestionActuelle = 0;
let timerMystere; 

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
let questionsQuiz = [];
let score = 0;
let totalQuestions = 0;

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function melangerTableau(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Fonction pour préparer une question avec réponses mélangées
function preparerQuestion(question) {
    let reponsesMelangees = question.reponses.map((reponse, index) => ({
        texte: reponse,
        estCorrect: index === 0 // La première réponse est supposée être la bonne
    }));

    melangerTableau(reponsesMelangees);

    return {
        texte: question.texte,
        reponses: reponsesMelangees
    };
}

// Fonction qui initialise le quiz (appelée au début et à chaque redémarrage)
function initialiserQuiz() {
    // Réinitialiser les variables
    indexQuestionActuelle = 0;
    score = 0;
    // Mélanger les questions et préparer le quiz
    questionsQuiz = melangerTableau([...window.questions]).map(preparerQuestion);
    totalQuestions = questionsQuiz.length;

    // Réinitialiser l'affichage sans afficher le score tout de suite
    afficherQuestion();
}

// Fonction pour afficher le score
function afficherScore() {
    const scoreElement = document.getElementById("score");
    if (!scoreElement) {
        const scoreDiv = document.createElement("div");
        scoreDiv.id = "score";
        document.querySelector("#conteneur-question").insertBefore(
            scoreDiv,
            document.getElementById("texte-question")
        );
    }
    document.getElementById("score").textContent = `Score : ${score}/${totalQuestions}`;
}

// Fonction pour afficher la question actuelle
function afficherQuestion() {
    // Si toutes les questions sont terminées
    if (indexQuestionActuelle >= questionsQuiz.length) {
        const messageFinal = score / totalQuestions > 0.75
            ? `<h2>Bravo, vous avez réussi ! 🎉</h2>`
            : `<h2>Fin du quiz ! 🎉</h2>`;

        document.getElementById("conteneur-question").innerHTML =
            `${messageFinal}
             <p>Votre score final : ${score}/${totalQuestions}</p>
             <button id="rejouer-btn">Recommencer le quiz</button>`; // Ajout du bouton "Rejouer"

        // Ajouter l'événement au bouton "Rejouer"
        const boutonRejouer = document.getElementById("rejouer-btn");
        boutonRejouer.addEventListener("click", rejouerQuiz); // Écouteur d'événement uniquement ici

        return;
    }

    // Afficher la question actuelle
    const questionActuelle = questionsQuiz[indexQuestionActuelle];

    document.getElementById("texte-question").textContent = questionActuelle.texte;
    document.getElementById("num-question").textContent =
        `Question ${indexQuestionActuelle + 1}/${questionsQuiz.length}`;

    const conteneurReponses = document.getElementById("conteneur-reponses");
    conteneurReponses.innerHTML = ""; // Réinitialiser les réponses

    // Créer les options de réponse pour la question actuelle
    questionActuelle.reponses.forEach((reponse, index) => {
        const divOption = document.createElement("div");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "reponse";
        input.value = index;
        input.id = "reponse" + index;
        input.dataset.correct = reponse.estCorrect;
        input.addEventListener("change", () => activerBoutonValider());

        const label = document.createElement("label");
        label.htmlFor = "reponse" + index;
        label.textContent = reponse.texte;

        divOption.appendChild(input);
        divOption.appendChild(label);
        conteneurReponses.appendChild(divOption);
    });

    // Désactiver le bouton de validation au début de chaque question
    document.getElementById("bouton-valider").disabled = true;

    //Ajout du bouton mystère
    afficherBoutonMystere();

    // 🔴 Initialisation du timer à chaque affichage de question
    clearInterval(timer);
    tempsRestant = parametres.temps;
    afficherTimer();
    timer = setInterval(decrementerTimer, 1000);
}

// Fonction pour activer le bouton de validation quand une réponse est sélectionnée
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

    if (reponseSelectionnee.dataset.correct === "true") {
        score++;
        afficherScore();
    }

    indexQuestionActuelle++;
    afficherQuestion();
}

// Fonction afficher le bouton "Mystère"
function afficherBoutonMystere() {
    const boutonMystere = document.getElementById("bouton-mystere");
    
    // 30% de chance d'afficher le bouton
    if (Math.random() < 0.5) {
        boutonMystere.style.display = "block";

        // Faire disparaître après 5 secondes si non cliqué
        timerMystere = setTimeout(() => {
            boutonMystere.style.display = "none";
        }, 5000);
    }
}

// Fonction pour appliquer un bonus ou malus
function effetMystere() {
    clearTimeout(timerMystere); // Empêche le bouton de disparaître après clic
    const effets = [
        { type: "bonus", message: "+1 point !", action: () => score++ },
        { type: "bonus", message: "Question gratuite !", action: poserQuestionBonus },
        { type: "bonus", message: "Temps supplémentaire ! (+5s)", action: () => modifierTemps(5) },
        { type: "malus", message: "-1 point !", action: () => score-- },
        { type: "malus", message: "Inversion des réponses !", action: inverserReponses },
        { type: "malus", message: "Temps réduit ! (-5s)", action: () => modifierTemps(-5) }
    ];

    // Sélection aléatoire d’un effet
    const effetChoisi = effets[Math.floor(Math.random() * effets.length)];
    Swal.fire({
        title: "🎁 Surprise !",
        text: effetChoisi.message,
        icon: effetChoisi.type === "bonus" ? "success" : "warning",
        confirmButtonText: "OK",
        timer: 3000,  // Ferme automatiquement après 3s
        showClass: {
            popup: "animate__animated animate__fadeInDown"
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutUp"
        }
    });
    
   effetChoisi.action();

    // Cacher le bouton après utilisation
    document.getElementById("bouton-mystere").style.display = "none";
}

// Fonction pour modifier le timer
function modifierTemps(valeur) {
    tempsRestant += valeur;

    // Empêcher d'avoir un temps négatif
    if (tempsRestant < 0) tempsRestant = 0;

    afficherTimer();
}

// Fonction pour inverser l'ordre des réponses
function inverserReponses() {
    // Vérifie qu'on est bien dans une question valide
    if (indexQuestionActuelle < questionsQuiz.length) {
        // Inverser l'ordre des réponses de la question actuelle
        questionsQuiz[indexQuestionActuelle].reponses.reverse();
        
        // Réafficher la question avec les réponses inversées
        afficherQuestion();
    }
}

// Fonction pour poser une question bonus immédiatement
function poserQuestionBonus() {
    clearInterval(timer); // Met en pause le timer principal

    // Sélectionner une question bonus au hasard
    const questionBonus = window.questionsBonus[Math.floor(Math.random() * window.questionsBonus.length)];

    Swal.fire({
        title: "🎁 Question Bonus !",
        text: questionBonus.texte,
        icon: "question",
        input: "radio",
        inputOptions: questionBonus.reponses.reduce((options, reponse, index) => {
            options[index] = reponse;
            return options;
        }, {}),
        confirmButtonText: "Valider",
        showCancelButton: false,
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            const reponseIndex = result.value; // Récupérer l'indice de la réponse sélectionnée
            const bonneReponse = questionBonus.reponses[0]; // La bonne réponse est toujours la première dans data.js
            let message, iconType;

            // Vérifier si la réponse choisie est correcte
            if (questionBonus.reponses[reponseIndex] === bonneReponse) {
                score++; // ✅ Augmenter le score si c'est correct
                afficherScore(); // ✅ Mettre à jour l'affichage du score
                message = `Bonne réponse ! 🎉 (+1 point)`;
                iconType = "success";
            } else {
                message = `Mauvaise réponse 😢 La bonne réponse était : "${bonneReponse}"`;
                iconType = "error";
            }

            // Afficher un message à l'utilisateur
            Swal.fire({
                title: iconType === "success" ? "🎉 Bravo !" : "❌ Oups...",
                text: message,
                icon: iconType,
                confirmButtonText: "Continuer"
            }).then(() => {
                // 🔹 Après la question bonus, reprendre la question normale
                reprendreQuestionNormale();
            });
        }
    });
}

// Fonction pour reprendre la question en cours après la question bonus
function reprendreQuestionNormale() {
    afficherTimer();  // Réafficher le temps restant
    timer = setInterval(decrementerTimer, 1000);  // Reprendre le timer
}

// Fonction pour rejouer le quiz (appelée après la fin du quiz)
function rejouerQuiz() {
    // Réinitialiser toutes les variables et recommencer
    initialiserQuiz();
}

window.afficherQuestion = afficherQuestion;
window.questionSuivante = questionSuivante;
window.initialiserQuiz = initialiserQuiz;
window.rejouerQuiz = rejouerQuiz;

document.getElementById("bouton-valider").addEventListener("click", questionSuivante);

document.addEventListener('DOMContentLoaded', initialiserQuiz);
