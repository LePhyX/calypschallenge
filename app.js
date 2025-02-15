// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

        if (challenge.link) {
          // Ajouter à la liste des défis réalisés
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><a href="${challenge.link}" target="_blank">${challenge.link}</a></td>
          `;
          completedTableBody.appendChild(row);
        } else {
          // Ajouter à la liste des défis en attente avec un bouton pour ajouter un lien
          row.innerHTML = `
            <td>${challenge.name}</td>
            <td>${challenge.challenge}</td>
            <td><button class="add-link" data-id="${key}">Ajouter lien</button></td>
          `;
          pendingTableBody.appendChild(row);
        }
      });

      // Ajouter un événement pour chaque bouton "Ajouter lien"
      document.querySelectorAll(".add-link").forEach(button => {
        button.addEventListener("click", function() {
          openLinkModal(this.dataset.id);
        });
      });
    }
  });
}

// Ouvrir la modale pour ajouter un lien
function openLinkModal(challengeId) {
  const modal = document.getElementById("addLinkModal");
  const closeModal = document.querySelector(".close");
  const saveLinkBtn = document.getElementById("saveLinkBtn");
  const linkInput = document.getElementById("linkInput");

  modal.style.display = "flex";

  closeModal.onclick = function() {
    modal.style.display = "none";
  };

  saveLinkBtn.onclick = function() {
    const link = linkInput.value;
    if (link) {
      const challengeRef = ref(db, 'challenges/' + challengeId);
      update(challengeRef, {
        link: link
      }).then(() => {
        modal.style.display = "none";
        updateTables(); // Mettre à jour les tableaux
      }).catch(error => {
        console.error("Erreur d'ajout de lien:", error);
      });
    }
  };
}

// Initialiser la mise à jour des tableaux
updateTables();
