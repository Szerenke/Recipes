/**
 * @param  {String}   url      
 * @param  {Function} callback 
 */

var getHTML = function (url, callback) {

    if (!window.XMLHttpRequest) return;
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (callback && typeof (callback) === 'function') {
            callback(this.responseXML);
        }
    }
    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
};

document.querySelector('#search').addEventListener("click", function () {
    warning.innerHTML = getInput();
    if(warning.innerHTML == ""){
        getHTML('https://www.mindmegette.hu/kategoria/elkeszites-ideje/', function (response) {
            let id = getID(response);
            getHTML(`https://www.mindmegette.hu/kategoria/elkeszites-ideje/${id}-perc/`, function (response) {
                let idID = "recom-" + id + "-perc";
                getRecipes(response, idID);
            });
        });
    }
});

function getInput() {
    let min = document.querySelector('#min').value;
    let max = document.querySelector('#max').value;
    let str = "";

    if(min == "" || max == ""){
        str = "Give a valid min and max value.";
        document.querySelector('#min').value = "";
        document.querySelector('#max').value = "";
    }
    else if(max < 15){
        str = "Time should be at leasast 15 minutes.";
        document.querySelector('#min').value = "";
        document.querySelector('#max').value = "";
    }
    else if (isNaN(min) || isNaN(max)) {
        str = "Wrong input.";
        document.querySelector('#min').value = "";
        document.querySelector('#max').value = "";
    }
    else if ((max - min) < 0) {
        str = "Max value should be greater than min value.";
        document.querySelector('#min').value = "";
        document.querySelector('#max').value = "";
    }
    return str;
}

function getID(response) {
    let minNUm = parseInt(document.querySelector('#min').value);
    let maxNUm = parseInt(document.querySelector('#max').value);

    let time = response.querySelectorAll('.gridTitle');
    var timeArray = Array.from(time);
    let id = "";

    for (let i = 0; i < timeArray.length; i++) {
        if (parseInt(timeArray[i].innerHTML) >= minNUm && parseInt(timeArray[i].innerHTML) <= maxNUm) {
            id = parseInt(timeArray[i].innerHTML);
        }
    }
    return id;
}

function getRecipes(response, idID) {
    var recommendations = response.querySelector(`#${idID}`);
    var recipes = recommendations.querySelectorAll('.pic');
    var recipesArray = Array.from(recipes);
    let div = document.querySelector('.flex-container');

    for (let i = 0; i < recipesArray.length; i++) {

        let childDiv = document.createElement('div');
        let image = document.createElement('img');
        let p = document.createElement('p');
        let a = document.createElement('a');
        let img = `${recipesArray[i].style.backgroundImage}`;
        let imgURL = img.slice(6, img.lastIndexOf(')')-1);
        let anchor = recipesArray[i].parentElement.parentElement;
        let att = anchor.href;

        image.src = 'https://www.mindmegette.hu/' +  imgURL ;
        a.href = att;
        a.target = '_blank';
        p.innerHTML = recipesArray[i].title;
        a.appendChild(image);
        childDiv.appendChild(a);
        childDiv.appendChild(p);
        div.appendChild(childDiv);
    }
}
