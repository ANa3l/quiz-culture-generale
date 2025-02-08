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

