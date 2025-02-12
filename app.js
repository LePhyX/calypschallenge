// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Configuration de ton projet Firebase avec tes informations
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
    challenge: challenge
  }).then(() => {
    // Une fois l'ajout terminé, mettre à jour le tableau
    updateTable();
  }).catch((error) => {
    console.error("Erreur d'ajout de défi:", error);
  });
});

// Mettre à jour le tableau avec les données depuis Firebase
function updateTable() {
  const tableBody = document.querySelector("#challengeTable tbody");
  tableBody.innerHTML = ""; // Vider le tableau

  const challengesRef = ref(db, 'challenges');
  
  // Observer les changements en temps réel sur la base de données
  onValue(challengesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        const challenge = data[key];
        const row = document.createElement("tr");
        row.innerHTML = `<td>${challenge.name}</td><td>${challenge.challenge}</td>`;
        tableBody.appendChild(row);
      });
    }
  });
}

// Initialiser le tableau au chargement de la page
updateTable();
