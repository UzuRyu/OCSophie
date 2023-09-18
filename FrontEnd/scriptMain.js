const contenuGallery = document.getElementsByClassName("gallery")[0];
const main = document.getElementsByTagName("main")[0];
const linkAPI = "http://localhost:5678/api";
const user =  JSON.parse(sessionStorage.getItem("storedUser"));
const modal = document.getElementById("modal-container");
const modalGallery = document.getElementById("modal-gallery");
const addForm = document.getElementById("addForm");

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
  renderAllWorks();
}

addForm.imgDropBox.addEventListener("change", (event) => {
  if (event.target.files.length > 0) {
    const fsize = event.target.files.item(0).size;
    const file = Math.round((fsize / 1024));
    if (file >= 4096) {
      alert("Fichier trop lourd. Veuillez choisir un ficher de moins de 4Mo");
      addForm.imgDropBox.value = '';
      document.getElementById("preview").src = '';
      document.getElementById("postPreview").style.display = 'block';
      document.getElementById("imgDropBoxBig").style.display = 'flex';
      document.getElementById("imgDropBoxSmall").style.display = 'block';
    }
    else {
      document.getElementById("preview").src = URL.createObjectURL(event.target.files[0]);
      document.getElementById("postPreview").style.display = 'none';
      document.getElementById("imgDropBoxBig").style.display = 'none';
      document.getElementById("imgDropBoxSmall").style.display = 'none';
    }
  }
})

addForm.addEventListener("change", () => {
  /* Obsolète
  addForm.workCat.setCustomValidity("");
  addForm.imgDropBox.setCustomValidity("");
  */
  if(addForm.workCat.value !== "0" && addForm.workTitle.value !== '' && addForm.imgDropBox.value !== ''){
    addForm.subAddWorkForm.style.setProperty('background-color', '#1D6154');
    if(document.getElementById("msgErreur") !== null){
    document.getElementById("msgErreur").remove();
    }
    console.log("yep");
  }
  else{
    addForm.subAddWorkForm.style.setProperty('background-color', '#A7A7A7');
    console.log("nope");
  }
})

addForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  /* Obsolète Message d'erreur Catégorie
  if(addForm.workCat.value == "0"){
    addForm.workCat.setCustomValidity("Veuillez choisir une catégorie.");
    addForm.workCat.reportValidity();
  }
  */
  /* Obsolète Message d'erreur Input Image 
  if(addForm.imgDropBox.value == ''){
    addForm.imgDropBox.setCustomValidity("Veuillez insérer une image.");
    addForm.imgDropBox.reportValidity();
  }
  */
  if(addForm.workCat.value !== "0" && addForm.workTitle.value !=='' && addForm.imgDropBox.value !== ''){
  try {
    let response = await fetch(linkAPI + '/works', {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': 'Bearer ' + user.token
      },
      body: new FormData(addForm)
    })
    if (response.status !== 201) {
      throw response;
    } else {
      responseJSON = await response.json();
      document.getElementById("modal-AddWork show").id = "modal-AddWork";
      renderAllWorks();
      renderAllWorksModal();

      // Nettoyage du Formulaire d'Ajout
      document.getElementById("preview").src = '';
      document.getElementById("postPreview").style.display = 'block';
      document.getElementById("imgDropBoxBig").style.display = 'flex';
      document.getElementById("imgDropBoxSmall").style.display = 'block';
      addForm.imgDropBox.value = '';
      addForm.workCat.value = '0';
      addForm.workTitle.value = '';
    }
  } 
  catch (error) {
    // Gestion des erreurs 
    console.log(error);
  }
}
  else{
    if(document.getElementById("msgErreur") == null){
    let spanError = document.createElement('span');
    spanError.append(document.createTextNode("Tous les champs sont requis."));
    spanError.setAttribute("id", "msgErreur");
    addForm.insertBefore(spanError, subAddWorkForm);
    }
  }
});

async function adminMode(){
  // Remplace Login par Logout //
  document.getElementsByTagName("li")[2].replaceChild(document.createTextNode("logout"), document.getElementsByTagName("li")[2].firstChild);

  // Ecriture de la Barre d'Administration //
  // Création des Eléments //
  let barre = document.createElement("div");
  let editButt = document.createElement("button");
  let icon = document.createElement("i");
  let editButt2 = document.createElement("span");
  let icon2 = document.createElement("i2");
  // Ajout des Attributs //
  barre.setAttribute('id', "adminBarre");
  icon.setAttribute('class',"fa-solid fa-pen-to-square")
  editButt.setAttribute('id', "editButt");
  icon2.setAttribute('class',"fa-solid fa-pen-to-square")
  editButt2.setAttribute('id', "editButt2");
  // Ajout au HTML //
  editButt.appendChild(icon);
  editButt.appendChild(document.createTextNode("Mode édition"));
  editButt2.appendChild(icon2);
  editButt2.appendChild(document.createTextNode("éditer"));
  barre.appendChild(editButt);
  document.getElementsByTagName("header")[0].prepend(barre);
  document.getElementsByTagName("h2")[1].append(editButt2);

  // Ajout des EventListeners de la Barre d'Administration //
  editButt.addEventListener("click", editMod);
  editButt2.addEventListener("click", editMod);
}


// Ouverture de la Gallerie de Modification
async function editMod(){
  document.getElementById("modal-container-gallery").id = "modal-container-gallery show";
}

// Ouverture de la Modale d'Ajout
document.getElementById("addWorkBtn").addEventListener("click", function() {
  document.getElementById("modal-container-gallery show").id = "modal-container-gallery";
  document.getElementById("modal-AddWork").id = "modal-AddWork show";
  addForm.subAddWorkForm.style.setProperty('background-color', '#A7A7A7');
})

// Fermeture de la Gallerie de Modification
document.getElementById("modal-exit").addEventListener("click", function() {
  document.getElementById("modal-container-gallery show").id = "modal-container-gallery";
})

// Retour à la Gallerie de Modification à partir de la Modale d'Ajout
document.getElementById("addmodal-back").addEventListener("click", function() {
  document.getElementById("modal-container-gallery").id = "modal-container-gallery show";
  document.getElementById("modal-AddWork show").id = "modal-AddWork";
  document.getElementById("preview").src = '';
  document.getElementById("postPreview").style.display = 'block';
  document.getElementById("imgDropBoxBig").style.display = 'flex';
  document.getElementById("imgDropBoxSmall").style.display = 'block';
  addForm.imgDropBox.value = '';
  addForm.workCat.value = '0';
  addForm.workTitle.value = '';
})

// Fermeture de la Modale d'Ajout
document.getElementById("addmodal-exit").addEventListener("click", function() {
  document.getElementById("modal-AddWork show").id = "modal-AddWork";
  document.getElementById("preview").src = '';
  document.getElementById("postPreview").style.display = 'block';
  document.getElementById("imgDropBoxBig").style.display = 'flex';
  document.getElementById("imgDropBoxSmall").style.display = 'block';
  addForm.imgDropBox.value = '';
  addForm.workCat.value = '0';
  addForm.workTitle.value = '';
})



renderAllWorks();

// Gestion du "bouton" de Login/Logout //
document.getElementsByTagName("li")[2].addEventListener("click", () => {
  if(user ==null){
    window.location.href = '.' + '/login/login.html';  // Redirection vers la page de Login //
  }
  else{
    window.sessionStorage.removeItem("storedUser");  // Déconnexion de l'utilisateur //
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
    newFigDelete.setAttribute('name',"deleteButt");
    newFigDelete.setAttribute('class',"deleteBtn");
    newFigDelete.setAttribute('value',i);
    newFigDelete.addEventListener("click", deleteWork.bind(this, work.id));
    iconDelete.setAttribute('class',"fa-solid fa-trash-can")
    newFigDelete.appendChild(iconDelete);
    newFigDiv.appendChild(newFig);
    newFigDiv.appendChild(newFigDelete);
    newFig.append(newFigImg);
    newFig.append(newFigCap);
    modalGallery.append(newFigDiv);
    i++
  });
}

if(user !== null){
  adminMode();
  renderAllWorksModal()
}

document.querySelectorAll("deleteBtn").forEach(a => {
  a.addEventListener("click",console.log(a.value));
})
