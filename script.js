async function getJson(url) {
    let response = await fetch(url);
    return await response.json();

}

async function fetchMoviesJSON(urls, counter, baseUrl) {
    let moviesLists = []
    for (let url of urls) {

        let response = await getJson(url);
        let moviesList = response.results;
        let urlNext = response.next;
        while (moviesList.length < counter) {
            let response = await getJson(urlNext);
            moviesList = moviesList.concat(response.results);
            urlNext = response.next;
        }
        moviesLists.push(moviesList);
    }
    let bestMovie = moviesLists[0][0];
    moviesLists[0].splice(0, 1);
    bestMovie = await getJson(baseUrl + bestMovie.id.toString());
    let detailMoviesObject = { "imgBestMovie": bestMovie };
    for (let carouselNumber in moviesLists) {
        for (let imageNumber = 0; imageNumber < counter - 1; imageNumber++) {
            let url = baseUrl + moviesLists[carouselNumber][imageNumber].id.toString()
            //key = "img1_2" ==> image one of the carousel two
            detailMoviesObject["im" + imageNumber.toString() + "_" + carouselNumber.toString()] = await getJson(url);
        }
    }
    return detailMoviesObject;
}

let genres = {
    "Films les mieux notés": "",
    "Animation": "Animation",
    "Aventure": "Adventure",
    "Action": "Action",
    "Comédie": "Comedy",
};
let moviesNumber = 10;
const baseUrl = "http://localhost:8000/api/v1/titles/";
const sortQuery = "?sort_by=-imdb_score";
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
        newLi.appendChild(newA);
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
        "Genre(s) : ": "genres",
        "Date de sortie : ": "date_published",
        "Rated : ": "rated",
        "Score Imdb : ": "imdb_score",
        "Réalisateurs : ": "directors",
        "Acteurs : ": "actors",
        "Durée (mn) : ": "duration",
        "Pays d'origine(s) : ": "countries",
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
