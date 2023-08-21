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

//** Obsolètes **//
/*
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
  if (id == 0) { await renderAllWorks();}
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

*/

async function renderAllWorks(){
  contenuGallery.innerHTML = '';
  let workJSON = await getAllWorks();
  workJSON.forEach((work) => {
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
  if (id == 0) { await renderAllWorks(); }
  else {
    contenuGallery.innerHTML = '';
    let workJSON = await getAllWorks();
    workJSON.forEach((work) => {
      if (work.categoryId == id) {
        let newFig = document.createElement("figure")
        let newFigImg = document.createElement("img");
        newFigImg.setAttribute('src',work.imageUrl.replace("http://localhost:5678", "../Backend"));
        newFigImg.setAttribute('alt',work.title);
        let newFigCap = document.createElement("figcaption", work.title);
        newFigCap.appendChild(document.createTextNode(work.title));
        newFig.append(newFigImg);
        newFig.append(newFigCap);
        contenuGallery.append(newFig);
      }
    });
  }
}


async function logIn() {
  let saveMain = main
  let div = '<div id="loginDiv">'
            + '<h2> Log In </h2>'
            + '<div id="logForm">'
              + '<label for="ident">E-mail</label>'
              + '<input type="email" id="ident">'
              + '<label for="pass">Mot de passe</label>'
              + '<input type="password" id="pass">'
              + '<input type="submit" value="Se connecter" id="subButton">'
            + '</div>'
            + '<a href="#">Mot de passe oublie</a>'
          + '</div>'
  main.innerHTML = div;
  document.getElementById("subButton").addEventListener("hover", auth(document.getElementById("ident").value, document.getElementById("pass").value));
}

async function auth(mail, pass){
  console.log("TestAuth");
}

renderAllWorks();

document.getElementsByTagName("li")[2].addEventListener("click", logIn);

/*document.getElementById("subButton").addEventListener("hover", auth(document.getElementById("ident").value, document.getElementById("pass").value));*/

document.getElementById("filtres").addEventListener("change", () => {
  Array.from(document.getElementsByName("filtre")).forEach((radio) => {
    if (radio.checked) {
      renderCat(radio.value);
    }
  });
});