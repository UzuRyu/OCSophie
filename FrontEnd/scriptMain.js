const contenuGallery = document.getElementsByClassName("gallery")[0];
const main = document.getElementsByTagName("main")[0];
const linkAPI = "http://localhost:5678/api";
const user =  window.localStorage.getItem("storedUser");

async function getAllWorks() {
  try {
    let res = await fetch(linkAPI + "/works");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderAllWorks(){
  console.log("All");
  contenuGallery.innerHTML = '';  // Nettoyage de la gallerie //   
  let workJSON = await getAllWorks();  // Obtention des travaux //
  workJSON.forEach((work) => {
    //** Ecriture des Figures suivi de leur ajout à la gallerie **//
    let newFig = document.createElement("figure")
    let newFigImg = document.createElement("img");
    newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
    newFigImg.setAttribute('alt',work.title);
    let newFigCap = document.createElement("figcaption", work.title);
    newFigCap.appendChild(document.createTextNode(work.title));
    newFig.append(newFigImg);
    newFig.append(newFigCap);
    contenuGallery.append(newFig);
  });
}

async function renderCat(id) {
  if (id == 0) { await renderAllWorks(); }  // Utilise renderAllWorks si le bouton est "Tous" //
  else {
    console.log("Cat");
    contenuGallery.innerHTML = '';  // Nettoyage de la gallerie //   
    let workJSON = await getAllWorks();  // Obtention des travaux //
    workJSON.forEach((work) => {
      if (work.categoryId == id) {
        //** Ecriture des Figures suivi de leur ajout à la gallerie **//
        let newFig = document.createElement("figure")
        let newFigImg = document.createElement("img");
        newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
        newFigImg.setAttribute('alt',work.title);
        let newFigCap = document.createElement("figcaption");
        newFigCap.appendChild(document.createTextNode(work.title));
        newFig.append(newFigImg);
        newFig.append(newFigCap);
        contenuGallery.append(newFig);
      }
    });
  }
}

function logInInit() {
  window.location.href = '.' + '/login/login.html';
}

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
      //** Réaffichage des Sections cachées et suppréssion de la Section de Login **//
      main.getElementsByTagName("Section")[0].setAttribute('style', 'display:flex');
      main.getElementsByTagName("Section")[1].setAttribute('style', 'display:block');
      main.getElementsByTagName("Section")[2].setAttribute('style', 'display:block');
      main.removeChild(main.lastChild);
      token = responseJSON;
      console.log(token);
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

renderAllWorks();

document.getElementsByTagName("li")[2].addEventListener("click", logInInit);

document.getElementById("filtres").addEventListener("change", () => {
  Array.from(document.getElementsByName("filtre")).forEach((radio) => {
    if (radio.checked) {
      renderCat(radio.value);
    }
  });
});

if(user.token !== null){
  alert("Bob");
  document.getElementsByTagName("li")[2].appendChild(document.createTextNode("logout"));
  document.getElementsByTagName("li")[2].removeChild(document.getElementsByTagName("li")[2].firstChild);
}
