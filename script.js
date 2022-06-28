
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
    "Toutes catégories": "",
    "Animation": "Animation",
    "Aventure": "Adventure",
    "Action": "Action",
};
let nameGenres = Object.keys(genres);
const baseUrl = "http://localhost:8000/api/v1/titles/";
const sortQuery = "?sort_by=-imdb_score"
const urls = [baseUrl + sortQuery];
for (let name of nameGenres.slice(1,)) { urls.push(baseUrl + sortQuery + "&genre=" + genres[name]) };
let moviesNumber = 7;
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
        if (element.nodeName == "INPUT") {
            let elementSplit = element.id.split("_");
            carousels[parseInt(elementSplit[1])][elementSplit[0]]();
        }
        else if (element.nodeName == "IMG") { displayModal(detailMoviesObject[element.id], modal) }
    }

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("details");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {

        displayModal(detailMoviesObject["imgBestMovie"], modal)

    }

    // When the user clicks on <span> (x), close the modal
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





class Carousel {
    constructor(detailMoviesObject, nameGenre, instanceNumber, moviesNumber) {
        let idCarousel = "carousel_" + instanceNumber.toString();
        let idImages = "images_" + instanceNumber.toString();
        let idLeftButton = "leftButton_" + instanceNumber.toString();
        let idRightButton = "rightButton_" + instanceNumber.toString();
        let body = document.querySelector("body");
        let newDiv = document.createElement("div");


        this.instanceNumber = instanceNumber;
        this.posCarousel = 0;
        this.numberImages = moviesNumber;
        const lengthCarousel = 4;
        this.maxPosCarousel = this.numberImages - lengthCarousel - 1;

        let newH1 = document.createElement("h1");
        newH1.innerText = nameGenre;
        body.appendChild(newH1);


        newDiv.classList.add("carousel");
        newDiv.id = idCarousel;
        body.appendChild(newDiv);

        newDiv = document.createElement("div");
        newDiv.classList.add("images");
        newDiv.id = idImages

        let newButton = document.createElement("input")
        newButton.id = idLeftButton
        newButton.type = "button"
        newButton.value = "<<"



        let div = document.querySelector("#" + idCarousel)
        div.appendChild(newButton);
        div.appendChild(newDiv);



        div = document.querySelector("#" + idImages);
        for (let i = 0; i < moviesNumber; i++) {

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

    rightButton() {
        if (this.posCarousel > 0) {
            this.posCarousel--;
            let im = document.getElementById("im" + this.posCarousel.toString() + "_" + this.instanceNumber.toString());
            im.style.order = (parseInt(im.style.order) - this.numberImages).toString();
        }
    }
    leftButton() {
        if (this.posCarousel <= this.maxPosCarousel) {
            let im = document.getElementById("im" + this.posCarousel.toString() + "_" + this.instanceNumber.toString());
            im.style.order = (parseInt(im.style.order) + this.numberImages).toString();
            this.posCarousel++;
        }
    }
}

/*
    const imageGenres = [["https://m.media-amazon.com/images/M/MV5BNjllNTdmYzItM2IwZi00OGIzLWJmZGItZDNiNjNjOGUyMzM5XkEyXkFqcGdeQXVyOTY3MzgxNTE@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BNjNiYTIwYmUtZDlmYy00MWMxLWI0OTAtMmRkODdlMTM1ZTVmXkEyXkFqcGdeQXVyNDcwNDE0Nzk@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BODc0NjViOTUtZWM1Ny00NWQyLTlhNTgtYmYxNTAxNzRkMGEwXkEyXkFqcGdeQXVyNjQ1MDcxNzM@._V1_UY268_CR14,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOWVmOWRmMWMtMDc2OC00NGM2LTllOTAtMmY5NjVhM2YzYjVlXkEyXkFqcGdeQXVyOTc2MTgwNjY@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BMWFhZDhkYzMtYjM3NC00OTAxLThhNTEtNmM3OGFjODE0OWU3XkEyXkFqcGdeQXVyMTE5NjAxMDQx._V1_UY268_CR73,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOTk4NGM0NmUtOTc2Yi00NTcxLWE3NGItYzEwODZjNzlhZjE2XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    ], ["https://m.media-amazon.com/images/M/MV5BNjllNTdmYzItM2IwZi00OGIzLWJmZGItZDNiNjNjOGUyMzM5XkEyXkFqcGdeQXVyOTY3MzgxNTE@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BNjNiYTIwYmUtZDlmYy00MWMxLWI0OTAtMmRkODdlMTM1ZTVmXkEyXkFqcGdeQXVyNDcwNDE0Nzk@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BODc0NjViOTUtZWM1Ny00NWQyLTlhNTgtYmYxNTAxNzRkMGEwXkEyXkFqcGdeQXVyNjQ1MDcxNzM@._V1_UY268_CR14,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOWVmOWRmMWMtMDc2OC00NGM2LTllOTAtMmY5NjVhM2YzYjVlXkEyXkFqcGdeQXVyOTc2MTgwNjY@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BMWFhZDhkYzMtYjM3NC00OTAxLThhNTEtNmM3OGFjODE0OWU3XkEyXkFqcGdeQXVyMTE5NjAxMDQx._V1_UY268_CR73,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOTk4NGM0NmUtOTc2Yi00NTcxLWE3NGItYzEwODZjNzlhZjE2XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    ], ["https://m.media-amazon.com/images/M/MV5BNjllNTdmYzItM2IwZi00OGIzLWJmZGItZDNiNjNjOGUyMzM5XkEyXkFqcGdeQXVyOTY3MzgxNTE@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BNjNiYTIwYmUtZDlmYy00MWMxLWI0OTAtMmRkODdlMTM1ZTVmXkEyXkFqcGdeQXVyNDcwNDE0Nzk@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BODc0NjViOTUtZWM1Ny00NWQyLTlhNTgtYmYxNTAxNzRkMGEwXkEyXkFqcGdeQXVyNjQ1MDcxNzM@._V1_UY268_CR14,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOWVmOWRmMWMtMDc2OC00NGM2LTllOTAtMmY5NjVhM2YzYjVlXkEyXkFqcGdeQXVyOTc2MTgwNjY@._V1_UY268_CR3,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BMWFhZDhkYzMtYjM3NC00OTAxLThhNTEtNmM3OGFjODE0OWU3XkEyXkFqcGdeQXVyMTE5NjAxMDQx._V1_UY268_CR73,0,182,268_AL_.jpg",
        "https://m.media-amazon.com/images/M/MV5BOTk4NGM0NmUtOTc2Yi00NTcxLWE3NGItYzEwODZjNzlhZjE2XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    ]]


window.onload = function () {
    let moviesNumber = 6;
    let carousels = [];
    for (images of imageGenres) {
        carousels.push(new Carousel(images, carousels.length, moviesNumber));
    }
    const body = document.querySelector("body");
    body.onclick = function (event) {
        const element = event.target;
        if (element.nodeName == "INPUT") {
            let elementSplit = element.id.split("_");
            carousels[parseInt(elementSplit[1])][elementSplit[0]]();
        }

    }

}*/
