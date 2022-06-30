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

        let div = document.querySelector("#" + idCarousel);

        let newButton = document.createElement("input");
        newButton.id = idLeftButton;
        newButton.type = "button";
        newButton.value = "<<";
        div.appendChild(newButton);

        newDiv = document.createElement("div");
        newDiv.classList.add("images");
        newDiv.id = idImages;
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
        }

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