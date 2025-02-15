// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

// Fonction pour ajouter un lien à un défi en attente
function addLinkToChallenge(challengeId) {
  const newLink = prompt("Entrez le lien du défi (doit commencer par http:// ou https://):");

  if (newLink && (newLink.startsWith("http://") || newLink.startsWith("https://"))) {
    const challengeRef = ref(db, 'challenges/' + challengeId);
    set(challengeRef, {
      name: challengeId, // Garder le nom du défi
      challenge: newLink
    }).then(() => {
      alert("Lien ajouté avec succès !");
    }).catch((error) => {
      console.error("Erreur lors de l'ajout du lien:", error);
    });
  } else {
    alert("Le lien doit commencer par 'http://' ou 'https://'");
  }
}

// Fonction pour modifier le lien d'un défi réalisé
function modifyLinkToChallenge(challengeId, currentChallenge) {
  const newLink = prompt("Entrez le nouveau lien :", currentChallenge);

  if (newLink && (newLink.startsWith("http://") || newLink.startsWith("https://"))) {
    const challengeRef = ref(db, 'challenges/' + challengeId);
    set(challengeRef, {
      name: challengeId,  // Garder le nom du défi
      challenge: newLink
    }).then(() => {
      alert("Lien mis à jour avec succès !");
    }).catch((error) => {
      console.error("Erreur lors de la mise à jour du lien:", error);
    });
  } else {
    alert("Le lien doit commencer par 'http://' ou 'https://'");
  }
}

// Mettre à jour les tableaux avec les données depuis Firebase
function updateTables() {
  const pendingTableBody = document.querySelector("#challengeTable tbody");
  const completedTableBody = document.querySelector("#completedChallengesTable tbody");

  pendingTableBody.innerHTML = ""; // Vider le tableau des défis en attente
  completedTableBody.innerHTML = ""; // Vider le tableau des défis réalisés

  const challengesRef = ref(db, 'challenges');

  // Observer les changements en temps réel sur la base de données
  onValue(challengesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        const challenge = data[key];
        const row = document.createElement("tr");

        if (challenge.challenge.includes("http://") || challenge.challenge.includes("https://")) {
          // Si le défi contient un lien, on l'ajoute au tableau des défis réalisés
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><a href="${challenge.challenge}" target="_blank">Voir</a></td>
            <td><button class="modify-link-btn" onclick="modifyLinkToChallenge('${key}', '${challenge.challenge}')">Modifier lien</button></td>
          `;
          completedTableBody.appendChild(row);
        } else {
          // Sinon, on l'ajoute au tableau des défis en attente
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><button class="modify-link-btn" onclick="addLinkToChallenge('${key}')">Ajouter lien</button></td>
          `;
          pendingTableBody.appendChild(row);
        }
      });
    }
  });
}

// Initialiser les tableaux au chargement de la page
updateTables();
