
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
xhr1.open("GET", "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=Fantasy"); 1

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
