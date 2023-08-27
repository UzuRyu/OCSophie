const linkAPI = "http://localhost:5678/api";
const logForm = document.getElementById("logForm");

logForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let user = {
    email: logForm.ident.value,
    password: logForm.pass.value
  }
  let responseJSON;
  try {
    let response = await fetch(linkAPI + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
    })
    if (response.status !== 200) {
      throw response;
    } else {
      responseJSON = await response.json();
      let resJSON = JSON.stringify(responseJSON);
      localStorage.setItem("storedUser", resJSON);
      window.location.href = '../' + 'index.html';
    }
  } catch (error) {
    //** Gestion des erreurs 
    if (error.status === 404) {
      alert("Utilisateur inconnu");
    } else if (error.status === 401) {
      alert("Mot de Passe erroné");
    } else {
      alert("Erreur ", error.status);
    }
  }
});
