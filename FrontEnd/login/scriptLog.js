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
      sessionStorage.setItem("storedUser", resJSON);
      window.location.href = '../' + 'index.html';
    }
  } catch (error) {
    //** Gestion des erreurs 
    if (error.status === 404) {
      console.log("Erreur 404");
      logForm.ident.style.setProperty('border', 'solid 1px red');
      logForm.ident.style.setProperty('border-radius', '5px');
      /* Obsolète
      logForm.ident.setCustomValidity("Utilisateur inconnu");
      logForm.ident.reportValidity();
      */
    } else if (error.status === 401) {
      console.log("Erreur 401");
      logForm.pass.style.setProperty('border', 'solid 1px red');
      logForm.pass.style.setProperty('border-radius', '5px');
      /* Obsolète
      logForm.pass.setCustomValidity("Mot de Passe erroné");
      logForm.pass.reportValidity();
      */
    } else {
      alert('Unknown Error');
    }
    if(document.getElementById("msgErreur") == null){
    let spanError = document.createElement('span');
    spanError.append(document.createTextNode("Erreur dans l’Identifiant ou le Mot de Passe."));
    spanError.setAttribute("id", "msgErreur");
    logForm.insertBefore(spanError, subButton);
    logForm.pass.style.setProperty('margin-bottom', '10px');
    }
  }
});

logForm.addEventListener('change', async () => {
  /* Obsolète
  // Reset Message d'erreur d'identifiant
  logForm.ident.setCustomValidity("");
  logForm.ident.reportValidity();
  // Reset Message d'erreur de mot de passe
  logForm.pass.setCustomValidity("");
  logForm.pass.reportValidity();
  */
  logForm.ident.style.setProperty('border', '');
  logForm.ident.style.setProperty('border-radius', '');
  logForm.pass.style.setProperty('border', '');
  logForm.pass.style.setProperty('border-radius', '');
  if(document.getElementById("msgErreur") !== null){
    document.getElementById("msgErreur").remove();
    logForm.pass.style.setProperty('margin-bottom', '47px');
  }
});