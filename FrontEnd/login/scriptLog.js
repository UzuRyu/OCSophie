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
      logForm.ident.setCustomValidity("Utilisateur inconnu");
      logForm.ident.reportValidity();
      setTimeout(resetForm, 500);
    } else if (error.status === 401) {
      logForm.pass.setCustomValidity("Mot de Passe erroné");
      logForm.pass.reportValidity();
      setTimeout(resetForm, 500);
    } else {
      alert('Unknown Error');
    }
  }
});

function resetForm() {
  // Reset Message d'erreur d'identifiant
  logForm.ident.setCustomValidity("");
  logForm.ident.reportValidity();
  // Reset Message d'erreur de mot de passe
  logForm.pass.setCustomValidity("");
  logForm.pass.reportValidity();
}