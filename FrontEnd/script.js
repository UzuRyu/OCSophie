const contenuGallery = document.getElementsByClassName("gallery")[0];
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
  let workJSON = await getAllWorks();
  let div = "";
  let figure = "";
  let imgURL = "";
  workJSON.forEach((work) => {
    if(work.categoryId == id) {
    imgURL = work.imageUrl.replace("http://localhost:5678", "../Backend");
    figure = '<figure> <img src="' + imgURL + '"alt="' + work.title + '"> <figcaption>' + work.title + "</figcaption> </figure>";
    div += figure;
    }
  });
  contenuGallery.innerHTML = div;
}

renderAllWorks();
