document.getElementById("challengeForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Récupérer les données du formulaire
  const name = document.getElementById("name").value;
  const challenge = document.getElementById("challenge").value;

  // Récupérer les données déjà stockées dans le localStorage
  let challenges = JSON.parse(localStorage.getItem("challenges")) || [];

  // Ajouter le nouveau défi aux données
  challenges.push({ name, challenge });

  // Sauvegarder les données dans le localStorage
  localStorage.setItem("challenges", JSON.stringify(challenges));

  // Mettre à jour le tableau
  updateTable();
});

function updateTable() {
  const challenges = JSON.parse(localStorage.getItem("challenges")) || [];
  const tableBody = document.querySelector("#challengeTable tbody");
  tableBody.innerHTML = ""; // Vider le tableau avant de le remplir

  challenges.forEach(challenge => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${challenge.name}</td><td>${challenge.challenge}</td>`;
    tableBody.appendChild(row);
  });
}

// Initialiser le tableau au chargement de la page
updateTable();
