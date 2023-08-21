const contenuGallery = document.getElementsByClassName("gallery")[0];
const main = document.getElementsByTagName("main")[0];
const linkAPI = "http://localhost:5678/api";

async function getAllWorks() {
  try {
    let res = await fetch(linkAPI + "/works");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderAllWorks() {
  let workJSON = await getAllWorks();
  let div = "";
  let figure = "";
  let imgURL = "";
  workJSON.forEach((work) => {
    imgURL = work.imageUrl.replace("http://localhost:5678", "../Backend");
    figure = '<figure> <img src="' + imgURL + '"alt="' + work.title + '"> <figcaption>' + work.title + "</figcaption> </figure>";
    div += figure;
  });
  contenuGallery.innerHTML = div;
}

async function renderCat(id) {
  if (id == 0) { await renderAllWorks(); }
  else {
    let workJSON = await getAllWorks();
    let div = "";
    let figure = "";
    let imgURL = "";
    workJSON.forEach((work) => {
      if (work.categoryId == id) {
        imgURL = work.imageUrl.replace("http://localhost:5678", "../Backend");
        figure = '<figure> <img src="' + imgURL + '"alt="' + work.title + '"> <figcaption>' + work.title + "</figcaption> </figure>";
        div += figure;
      }
    });
    contenuGallery.innerHTML = div;
  }
}

async function logIn() {
  let saveMain = main
  let div = '<div id="loginDiv">'
            + '<h2> Log In </h2>'
            + '<form id="logForm">'
              + '<label for="ident">E-mail</label>'
              + '<input type="email" id="ident">'
              + '<label for="pass">Mot de passe</label>'
              + '<input type="password" id="pass">'
              + '<input type="submit" value="Se connecter" id="subButton">'
            + '</form>'
            + '<a href="#">Mot de passe oublie</a>'
          + '</div>'
  main.innerHTML = div;
}

renderAllWorks();

document.getElementsByTagName("li")[2].addEventListener("click", logIn);

document.getElementById("filtres").addEventListener("click", () => {
  Array.from(document.getElementsByName("filtre")).forEach((radio) => {
    if (radio.checked) {
      renderCat(radio.value);
    }
  });
});