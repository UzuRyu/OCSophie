const linkAPI = "http://localhost:5678/api";

async function auth() {
  //** Obtention de l'e-mail et du mot de passe donnés **//
  let user = {
    email: document.getElementById("ident").value,
    password: document.getElementById("pass").value
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
    console.log(response.status);
    if (response.status !== 200) {
      console.log(response.status);
      throw response;
    } else {
      responseJSON = await response.json();
      let resJSON = JSON.stringify(responseJSON);
      window.localStorage.setItem("storedUser", resJSON);
      window.location.href = '../' + 'index.html';
    }
  } catch (error) {
    //** Gestion des erreurs **//
    if (error.status === 404) {
      console.log(error.status);
      alert("Utilisateur inconnu");
    } else if (error.status === 401) {
      console.log(error.status);
      alert("Mot de Passe erroné");
    } else {
      console.log(error.status);
      alert("Erreur ", error.status);
    }
  }
}

document.getElementById("subButton").addEventListener("click", auth);