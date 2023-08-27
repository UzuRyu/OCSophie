const contenuGallery = document.getElementsByClassName("gallery")[0];
const main = document.getElementsByTagName("main")[0];
const linkAPI = "http://localhost:5678/api";
const user =  JSON.parse(localStorage.getItem("storedUser"));
const modal = document.getElementById("modal-container");
const modalGallery = document.getElementById("modal-gallery");

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
    // Ecriture des Figures suivi de leur ajout à la gallerie //
    let newFig = document.createElement("figure");
    let newFigImg = document.createElement("img");
    let newFigCap = document.createElement("figcaption");
    newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
    newFigImg.setAttribute('alt',work.title);
    newFigCap.appendChild(document.createTextNode(work.id));
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
        // Ecriture des Figures suivi de leur ajout à la gallerie //
        let newFig = document.createElement("figure");
        let newFigImg = document.createElement("img");
        let newFigCap = document.createElement("figcaption");
        newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
        newFigImg.setAttribute('alt',work.title);
        newFigCap.appendChild(document.createTextNode(work.title));
        newFig.append(newFigImg);
        newFig.append(newFigCap);
        contenuGallery.append(newFig);
      }
    });
  }
}

async function renderAllWorksModal(){
  console.log("All");
  modalGallery.innerHTML = '';  // Nettoyage de la gallerie //   
  let workJSON = await getAllWorks();  // Obtention des travaux //
  let i = 1;
  workJSON.forEach((work) => {
    // Ecriture des Figures suivi de leur ajout à la gallerie //
    let newFigDiv = document.createElement("div");
    let newFig = document.createElement("figure");
    let newFigImg = document.createElement("img");
    let newFigCap = document.createElement("figcaption");
    let newFigDelete = document.createElement("button");
    let iconDelete = document.createElement("i");
    newFigDiv.setAttribute('id', "idFig" + i);
    newFigDiv.setAttribute('class', "figDiv");
    newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
    newFigImg.setAttribute('alt',work.title);
    //newFigDelete.setAttribute('type',"radio");
    newFigDelete.setAttribute('name',"deleteButt");
    newFigDelete.setAttribute('class',"deleteBtn");
    newFigDelete.setAttribute('value',i);
    iconDelete.setAttribute('class',"fa-solid fa-trash-can")
    newFigDelete.appendChild(iconDelete);
    newFigDiv.appendChild(newFig);
    newFigDiv.appendChild(newFigDelete);
    newFigCap.appendChild(document.createTextNode("éditer"));
    newFig.append(newFigImg);
    newFig.append(newFigCap);
    modalGallery.append(newFigDiv);
    i++
  });
  let everyDeleteBtn = document.getElementsByClassName("deleteBtn");
  for(let f = 1;f <= everyDeleteBtn.length; f++){
    everyDeleteBtn[f].addEventListener("click", deleteWork.bind(this, f));
  }
}

async function deleteWork(id){
  const response = await fetch(linkAPI + '/works/' + id, {
    method: "DELETE",
    headers: {
      'Accept': '*/*',
      'Authorization': 'Bearer ' + user.token
    },
    body: JSON.stringify(user)
  });
  console.log(user.token);
  console.log(response);
  renderAllWorksModal();
}

async function adminMode(){
  // Remplace Login par Logout //
  document.getElementsByTagName("li")[2].replaceChild(document.createTextNode("logout"), document.getElementsByTagName("li")[2].firstChild);

  // Ecriture de la Barre d'Administration //
  // Création des Eléments //
  let barre = document.createElement("div");
  let editButt = document.createElement("button");
  let confirmButt = document.createElement("button");
  let icon = document.createElement("i");
  // Ajout des Attributs //
  barre.setAttribute('id', "adminBarre");
  icon.setAttribute('class',"fa-solid fa-pen-to-square")
  editButt.setAttribute('id', "editButt");
  confirmButt.setAttribute('id', "confirmButt");
  // Ajout au document //
  editButt.appendChild(icon);
  editButt.appendChild(document.createTextNode("Mode édition"));
  confirmButt.appendChild(document.createTextNode("publier les changements"));
  barre.appendChild(editButt);
  barre.appendChild(confirmButt);
  document.getElementsByTagName("header")[0].prepend(barre);

  // Ajout des EventListeners de la Barre d'Administration //
  editButt.addEventListener("click", editMod);
  confirmButt.addEventListener("click", valid);
}

async function editMod(){
  modal.style.display = null;
}

async function valid(){
  console.log("valid");
}

renderAllWorks();
renderAllWorksModal()

// Gestion du "bouton" de Login/Logout //
document.getElementsByTagName("li")[2].addEventListener("click", () => {
  if(user ==null){
    window.location.href = '.' + '/login/login.html';  // Redirection vers la page de Login //
  }
  else{
    window.localStorage.removeItem("storedUser");  // Déconnexion de l'utilisateur //
    window.location.href = window.location.href;
  }
});

// Gestion des boutons des Filtres //
document.getElementById("filtres").addEventListener("change", () => {
  Array.from(document.getElementsByName("filtre")).forEach((radio) => {
    if (radio.checked) {
      renderCat(radio.value);
    }
  });
});

if(user !== null){
  adminMode();
}

document.querySelectorAll("deleteBtn").forEach(a => {
  a.addEventListener("click",console.log(a.value));
})
