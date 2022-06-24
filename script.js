/*
console.log("hello THE world");
var xhr = new XMLHttpRequest();

//xhr.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score");
xhr.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Sci-Fi");
xhr.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy");
xhr.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Action");
console.log(xhr.readyState)
//var response = JSON.parse(xhr.responseText);
//xhr.responseType = "json"

xhr.onload = function () {
    response = JSON.parse(xhr.responseText)
    for (let i = 0; i < 3; i++) {
        console.log(response.results[i].id)
        console.log(response.results[i].image_url);
    }

}
xhr.send()
console.log("hello THE world");

var xhr1 = new XMLHttpRequest();
xhr1.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy");

//var response = JSON.parse(xhr.responseText);
//xhr.responseType = "json"

xhr1.onload = function () {
    response = JSON.parse(xhr1.responseText)
    for (let i = 0; i < 3; i++) {
        console.log(response.results[i].id)
        console.log(response.results[i].image_url);
    }

}
xhr1.send()
console.log("hello THE world");
*/
function retrieveMovies(url, moviesNumber) {
    let xhr = new XMLHttpRequest();
    xhr.open("Get", url)
    xhr.onload = function () {
        response = JSON.parse(xhr.responseText)
        for (let i = 0; i < moviesNumber; i++) {
            console.log(response.results[i].id)
            console.log(response.results[i].image_url);
        }

    }
    xhr.send()
}


let url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy"
let moviesNumber = 7
retrieveMovies(url, moviesNumber);



class Carousel {
    constructor(images, instanceNumber, moviesNumber) {
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
        for (let im of images) {
            let newImg = document.createElement("img");
            newImg.src = im;
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
function message(objet) { }

window.onload = function () {

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

}

