class Carousel {
    constructor(detailMoviesObject, nameGenre, instanceNumber, moviesNumber) {
        let idCarousel = "carousel_" + instanceNumber.toString();
        let idImages = "images_" + instanceNumber.toString();
        let idLeftButton = "leftButton_" + instanceNumber.toString();
        let idRightButton = "rightButton_" + instanceNumber.toString();

        this.instanceNumber = instanceNumber;
        this.indexImage = 0;//index of the image on the left in the carousel
        this.numberImages = moviesNumber;


        let body = document.querySelector("body");

        let newH1 = document.createElement("h1");
        newH1.innerText = nameGenre;
        newH1.id = "title_" + instanceNumber.toString();
        body.appendChild(newH1);

        let newDiv = document.createElement("div");
        newDiv.classList.add("carousel");
        newDiv.id = idCarousel;
        body.appendChild(newDiv);

        let div = document.querySelector("#" + idCarousel)

        let newButton = document.createElement("input")
        newButton.id = idLeftButton
        newButton.type = "button"
        newButton.value = "<<"
        div.appendChild(newButton);

        newDiv = document.createElement("div");
        newDiv.classList.add("images");
        newDiv.id = idImages
        div.appendChild(newDiv);

        div = document.querySelector("#" + idImages);
        //add the images in the carousel
        for (let i = 0; i < moviesNumber; i++) {
            //id = "img1_2" ==> image one of the carousel two
            let id = "im" + i.toString() + "_" + this.instanceNumber.toString();
            let newImg = document.createElement("img");
            newImg.src = detailMoviesObject[id].image_url;
            newImg.alt = detailMoviesObject[id].title;
            newImg.id = id;
            newImg.style.order = i.toString();
            div.appendChild(newImg);
        };

        newButton = document.createElement("input");
        newButton.id = idRightButton;
        newButton.type = "button";
        newButton.value = ">>";
        div = document.querySelector("#" + idCarousel);
        div.appendChild(newButton);

    }

    /*to scroll the images we change the css order property of the
    leftmost image if we press the left button or the rightmost image
    (which is not visible) if we press the right button (plus or minus the number of images)*/

    rightButton() {
        let indice = (this.indexImage + this.numberImages - 1) % this.numberImages;
        let im = document.getElementById("im" + indice.toString() + "_" + this.instanceNumber.toString());
        im.style.order = (parseInt(im.style.order) - this.numberImages).toString();
        this.indexImage--;
        if (this.indexImage == -1) { this.indexImage = this.numberImages - 1 };

    }
    leftButton() {
        let im = document.getElementById("im" + this.indexImage.toString() + "_" + this.instanceNumber.toString());
        im.style.order = (parseInt(im.style.order) + this.numberImages).toString();
        this.indexImage++;
        if (this.indexImage == this.numberImages) { this.indexImage = 0 };
    }
}
async function fetchMoviesJSON(urls, counter, baseUrl) {
    let moviesLists = []
    for (let url of urls) {
        let response = await fetch(url);
        response = await response.json();
        let moviesList = response.results;
        let urlNext = response.next;
        while (moviesList.length < counter) {
            let response = await fetch(urlNext);
            response = await response.json();
            moviesList = moviesList.concat(response.results);
            urlNext = response.next;
        }
        moviesLists.push(moviesList);
    };
    let bestMovie = moviesLists[0][0];
    moviesLists[0].splice(0, 1);
    let response = await fetch(baseUrl + bestMovie.id.toString());
    bestMovie = await response.json();
    let detailMoviesObject = { "imgBestMovie": bestMovie };
    for (let carouselNumber in moviesLists) {
        for (let imageNumber = 0; imageNumber < counter - 1; imageNumber++) {
            let response = await fetch(baseUrl + moviesLists[carouselNumber][imageNumber].id.toString());
            detailMoviesObject["im" + imageNumber.toString() + "_" + carouselNumber.toString()] = await response.json();
        }
    }
    return detailMoviesObject;
}

let genres = {
    "Films les mieux notés": "",
    "Animation": "Animation",
    "Aventure": "Adventure",
    "Action": "Action",
};
let moviesNumber = 7;
const baseUrl = "http://localhost:8000/api/v1/titles/";
const sortQuery = "?sort_by=-imdb_score"
const urls = [baseUrl + sortQuery];
const nameGenres = Object.keys(genres);
for (let name of nameGenres.slice(1,)) { urls.push(baseUrl + sortQuery + "&genre=" + genres[name]) };

fetchMoviesJSON(urls, moviesNumber + 1, baseUrl)
    .then(detailMoviesObject => display(detailMoviesObject, moviesNumber));

function display(detailMoviesObject, moviesNumber) {

    let bestMovie = detailMoviesObject["imgBestMovie"];
    document.querySelector("#imgBestMovie").src = bestMovie.image_url;
    document.querySelector("#imgBestMovie").alt = bestMovie.title;
    document.querySelector("#titleBestMovie").innerText = bestMovie.title;
    document.querySelector("#summaryBestMovie").innerText = bestMovie.description;

    let carousels = [];
    for (let i in nameGenres) {
        carousels.push(new Carousel(detailMoviesObject, nameGenres[i], i, moviesNumber));
    }

    const body = document.querySelector("body");
    body.onclick = function (event) {

        const element = event.target;
        //click on the right or left buttons
        if (element.nodeName == "INPUT") {
            let elementSplit = element.id.split("_");
            carousels[parseInt(elementSplit[1])][elementSplit[0]]();
        }
        //click on an image but not the logo (the logo has not id)
        else if (element.nodeName == "IMG" && element.id) { displayModal(detailMoviesObject[element.id], modal) }
    }

    //add links for categories
    let ul = document.querySelector("ul");
    for (let i in nameGenres) {
        let newLi = document.createElement("li");
        let newA = document.createElement("a");
        newA.href = "#title_" + i.toString();
        newA.innerText = nameGenres[i];
        newLi.appendChild(newA)
        ul.appendChild(newLi);
    }

    // modal window management
    let modal = document.getElementById("myModal");
    let button = document.getElementById("details");
    let span = document.getElementsByClassName("close")[0];

    button.onclick = function () {
        displayModal(detailMoviesObject["imgBestMovie"], modal)
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
function displayModal(movieDetail, modal) {
    modal.style.display = "block";
    let img = document.querySelector("#imageModal");
    img.src = movieDetail.image_url;
    img.alt = movieDetail.title;
    let fields = {
        "Titre : ": "title",
        "Genres : ": "genres",
        "Date de sortie : ": "date_published",
        "Rated : ": "rated",
        "Score Imdb : ": "imdb_score",
        "Réalisateurs : ": "directors",
        "Acteurs : ": "actors",
        "Durée (mn) : ": "duration",
        "Pays d'origine : ": "countries",
        "Résultat au Box Office : ": "worldwide_gross_income",
        "Résumé : ": "description"
    };
    let i = 1;
    for (let labelField of Object.keys(fields)) {
        let para = document.querySelector("#modal" + i.toString());
        para.innerText = labelField + movieDetail[fields[labelField]];
        i++;
    }

}
