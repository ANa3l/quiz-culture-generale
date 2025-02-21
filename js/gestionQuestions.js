let indexQuestionActuelle = 0;
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
}

// Fonction pour activer le bouton de validation quand une réponse est sélectionnée
function activerBoutonValider() {
    document.getElementById("bouton-valider").disabled = false;
}

// Fonction pour passer à la question suivante
function questionSuivante() {
    const reponseSelectionnee = document.querySelector('input[name="reponse"]:checked');
    if (!reponseSelectionnee) return;

    if (reponseSelectionnee.dataset.correct === "true") {
        score++;
        afficherScore();
    }

    indexQuestionActuelle++;
    afficherQuestion();
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
