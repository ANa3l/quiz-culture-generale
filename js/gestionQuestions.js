let indexQuestionActuelle = 0;
let score = 0; 
let timerMystere; 

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

    //Ajout du bouton mystère
    afficherBoutonMystere();
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

// Fonction afficher le bouton "Mystère"
function afficherBoutonMystere() {
    const boutonMystere = document.getElementById("bouton-mystere");
    
    // 30% de chance d'afficher le bouton
    if (Math.random() < 0.3) {
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
        { type: "bonus", message: "Question gratuite !", action: () => indexQuestionActuelle++ },
        { type: "bonus", message: "Temps supplémentaire !", action: () => console.log("Ajout de temps") },
        { type: "malus", message: "-1 point !", action: () => score-- },
        { type: "malus", message: "Inversion des réponses !", action: inverserReponses },
        { type: "malus", message: "Temps réduit !", action: () => console.log("Temps réduit") }
    ];

    // Sélection aléatoire d’un effet
    const effetChoisi = effets[Math.floor(Math.random() * effets.length)];
    alert(effetChoisi.message);
    effetChoisi.action();

    // Cacher le bouton après utilisation
    document.getElementById("bouton-mystere").style.display = "none";
}

// Fonction pour inverser l'ordre des réponses
function inverserReponses() {
    window.questions[indexQuestionActuelle].reponses.reverse();
    afficherQuestion();
}

// Rendre les fonctions accessibles dans `main.js`
window.afficherQuestion = afficherQuestion;
window.questionSuivante = questionSuivante;
