
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
    return [bestMovie, moviesLists];
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
console.log(urls)
fetchMoviesJSON(urls, moviesNumber + 1, baseUrl)
    .then(moviesArray => display(moviesArray[0], moviesArray[1], moviesNumber));


function display(bestMovie, moviesLists, moviesNumber) {

    console.log(bestMovie);
    console.log(moviesLists)

    document.querySelector("#imgBestMovie").src = bestMovie.image_url;
    document.querySelector("#titleBestMovie").innerText = bestMovie.title;
    document.querySelector("#summaryBestMovie").innerText = bestMovie.description;
    let carousels = [];
    for (let i in moviesLists) {
        carousels.push(new Carousel(nameGenres[i], moviesLists[i], carousels.length, moviesNumber));
    }
    const body = document.querySelector("body");
    body.onclick = function (event) {
        const element = event.target;
        if (element.nodeName == "INPUT") {
            let elementSplit = element.id.split("_");
            carousels[parseInt(elementSplit[1])][elementSplit[0]]();
        }


    }
}



class Carousel {
    constructor(nameGenre, moviesList, instanceNumber, moviesNumber) {
        let idCarousel = "carousel_" + instanceNumber.toString();
        let idImages = "images_" + instanceNumber.toString();
        let idLeftButton = "leftButton_" + instanceNumber.toString();
        let idRightButton = "rightButton_" + instanceNumber.toString();
        let body = document.querySelector("body");
        let newDiv = document.createElement("div");


        this.instanceNumber = instanceNumber;
        this.posCarousel = 1;
        this.numberImages = moviesNumber;
        const lengthCarousel = 4;
        this.maxPosCarousel = this.numberImages - lengthCarousel;

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



        div = document.querySelector("#" + idImages)
        let i = 1;
        for (let movie of moviesList) {
            let newImg = document.createElement("img");
            newImg.src = movie.image_url;
            newImg.alt = movie.title;
            newImg.id = "im" + i.toString() + "_" + this.instanceNumber.toString();
            newImg.style.order = i.toString();
            div.appendChild(newImg);
            i++;
        }

        newButton = document.createElement("input")
        newButton.id = idRightButton
        newButton.type = "button"
        newButton.value = ">>"



        div = document.querySelector("#" + idCarousel)
        div.appendChild(newButton);

    }

    rightButton() {
        if (this.posCarousel > 1) {
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
