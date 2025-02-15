// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, update, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuration de Firebase
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
document.getElementById("challengeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const challenge = document.getElementById("challenge").value;

  // Référence à la base de données
  const challengesRef = ref(db, 'challenges');

  // Ajouter un nouveau défi avec un ID unique
  const newChallengeRef = push(challengesRef);
  set(newChallengeRef, {
    name: name,
    challenge: challenge,
    lien: "" // Lien vide au départ
  }).then(() => {
    updateTable(); // Mettre à jour le tableau
  }).catch((error) => {
    console.error("Erreur d'ajout de défi:", error);
  });
});

// Mettre à jour le tableau avec les données depuis Firebase
function updateTable() {
  const tableBody = document.querySelector("#challengeTable tbody");
  tableBody.innerHTML = ""; // Vider le tableau

  const challengesRef = ref(db, 'challenges');
  
  onValue(challengesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        const challenge = data[key];
        const row = document.createElement("tr");
        
        row.innerHTML = `
          <td>${challenge.name}</td>
          <td>${challenge.challenge}</td>
          <td><a href="${challenge.lien || '#'}" target="_blank">${challenge.lien ? "Voir le lien" : "Ajouter un lien"}</a></td>
          <td><button onclick="modifierLien('${key}')">Modifier</button></td>
        `;
        tableBody.appendChild(row);
      });
    }
  });
}

// Fonction pour modifier le lien d'un défi
window.modifierLien = function(idDefi) {
  const newLink = prompt("Entrez le nouveau lien :");
  if (newLink) {
    const challengeRef = ref(db, `challenges/${idDefi}`);
    update(challengeRef, {
      lien: newLink
    }).then(() => {
      updateTable(); // Rafraîchir la table
    }).catch((error) => {
      console.error("Erreur lors de la mise à jour du lien :", error);
    });
  }
};

// Initialiser le tableau au chargement de la page
updateTable();
