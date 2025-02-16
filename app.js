// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1b2lC3XhvpyuLD5-HSFwcy0fXAw-jAGk",
  authDomain: "deficalypso.firebaseapp.com",
  databaseURL: "https://deficalypso-default-rtdb.firebaseio.com",
  projectId: "deficalypso",
  storageBucket: "deficalypso.firebasestorage.app",
  messagingSenderId: "1046975151655",
  appId: "1:1046975151655:web:98c7da596fcb21eea99802",
  measurementId: "G-Q1WR5N0TE3"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Gérer l'ajout de défi au formulaire
document.getElementById("challengeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const challenge = document.getElementById("challenge").value;

  // Référence à la base de données
  const challengesRef = ref(db, 'challenges');

  // Ajouter un nouveau défi avec un ID unique
  const newChallengeRef = push(challengesRef);
  set(newChallengeRef, {
    name: name,
    challenge: challenge
  }).then(() => {
    // Réinitialiser le formulaire
    document.getElementById("challengeForm").reset();
  }).catch((error) => {
    console.error("Erreur d'ajout de défi:", error);
  });
});

// Fonction pour ajouter un lien à un défi existant
function addLinkToChallenge(challengeId) {
  const newLink = prompt("Entrez le nouveau lien pour ce défi:");

  if (newLink && (newLink.startsWith("http://") || newLink.startsWith("https://"))) {
    const challengeRef = ref(db, 'challenges/' + challengeId); // Référence au défi spécifique

    get(challengeRef).then((snapshot) => {
      if (snapshot.exists()) {
        const challengeData = snapshot.val();

        // Mettre à jour uniquement le champ "link"
        update(challengeRef, {
          link: newLink  // Ajoute un champ "link" au défi existant
        }).then(() => {
          alert("Lien ajouté avec succès !");
        }).catch((error) => {
          console.error("Erreur lors de l'ajout du lien :", error);
        });
      } else {
        alert("Défi introuvable.");
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });

  } else {
    alert("Veuillez entrer un lien valide.");
  }
}

// Mettre à jour les tableaux avec les données depuis Firebase
function updateTables() {
  const pendingTableBody = document.querySelector("#challengeTable tbody");
  const completedTableBody = document.querySelector("#completedChallengesTable tbody");

  pendingTableBody.innerHTML = ""; // Vider le tableau des défis en attente
  completedTableBody.innerHTML = ""; // Vider le tableau des défis réalisés

  const challengesRef = ref(db, 'challenges');

  onValue(challengesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        const challenge = data[key];
        const row = document.createElement("tr");

        if (challenge.link) {
          // Si un lien existe, le défi est considéré comme réalisé
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><a href="${challenge.link}" target="_blank">Voir</a></td>
            <td><button onclick="addLinkToChallenge('${key}')">Modifier lien</button></td>
          `;
          completedTableBody.appendChild(row);
        } else {
          // Sinon, il est toujours en attente
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><button onclick="addLinkToChallenge('${key}')">Ajouter lien</button></td>
          `;
          pendingTableBody.appendChild(row);
        }
      });
    }
  });
}

// Initialiser les tableaux au chargement de la page
updateTables();
