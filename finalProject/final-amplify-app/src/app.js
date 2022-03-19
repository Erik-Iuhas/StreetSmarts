import Amplify, { API, graphqlOperation } from "aws-amplify";

import awsconfig from "./aws-exports";
import { createOBSTRUCTIONTABLE } from "./graphql/mutations";
import { createSIDEWALKTABLE } from "./graphql/mutations";
import { getSIDEWALKTABLE, listOBSTRUCTIONTABLES } from "./graphql/queries";
import { listSIDEWALKTABLES } from "./graphql/queries";


Amplify.configure(awsconfig);

let CLICK_TO_ADD_MARKER = true;
let DOWNLOAD_ROUTE_FILE = false;

obstructionsType = document.getElementById("obstructions");

hideTextBox = document.getElementById("otherBox");
//hideTextBox.style.visibility = "hidden";
hideTextBox.style.display = "none";

obstructionsType.addEventListener("change", obstruction);

placeSearch({
    key: '0XIrfA8qHXnvu0fdwvrvOKFU1BjmKhva',
    container: document.querySelector('#search-start'),
    useDeviceLocation: true,
    collection: [
        'poi',
        'airport',
        'address',
        'adminArea',
    ]
});

placeSearch({
    key: '0XIrfA8qHXnvu0fdwvrvOKFU1BjmKhva',
    container: document.querySelector('#search-end'),
    useDeviceLocation: true,
    collection: [
        'poi',
        'airport',
        'address',
        'adminArea',
    ]
});

//key
var t1 = "MFhJcmZBOHFIWG52dTBmZHd";
var t2 = "2cnZPS0ZVMUJqbUtodmE=";
var t3 = atob(t1+t2);
L.mapquest.key = t3;

//create map
var map = L.mapquest.map('map', {
    center: [45.284501916919176, -75.7155364751816],
    layers: L.mapquest.tileLayer('map'),
    zoom: 14
});
var layerGroup = L.layerGroup().addTo(map);

if(CLICK_TO_ADD_MARKER){
    map.on('click', addMarker);
    
}


function addMarker(e){
    // Add marker to map at click location; add popup window
    layerGroup.clearLayers();
    var newMarker = new L.marker(e.latlng).bindPopup('<button id="obstr">Clickkkkkk me</button>' + e.latlng).addTo(map);
    newMarker.addTo(layerGroup);
    newMarker.on("click", function (event){
        document.getElementById("obstr").addEventListener("click", addObstr);
    });
    console.log("Marker added at : " + e.latlng);
}

function formatPts(p1, p2){
    var str = "P1:" + p1.lat + "," + p1.lng + "_P2:" + p2.lat + "," + p2.lng;
    return str;
}

function drawLine(input){

    var arr = input.route.shape.shapePoints
    console.log(arr);
    for(let pt1 = 0; pt1 < arr.length; pt1++){
        console.log(pt1 + " " + arr[pt1])
        try{
            //console.log(arr[pt1]);
            console.log(arr[pt1+1].lat)
            //var line = [arr[pt1], arr[pt1+1]];
            readSidewalk(formatPts(arr[pt1], arr[pt1+1]), arr[pt1], arr[pt1+1]);
            //console.log(col);
        }catch (e) {
            console.log(e);
        }
    }
    //input.route.shape.shapePoints





    //,,,{"lat":45.399566,"lng":-75.634361},{"lat":45.399822,"lng":-75.630828},{"lat":45.399864,"lng":-75.630241},{"lat":45.399887,"lng":-75.62986699999999},{"lat":45.399921,"lng":-75.629364},{"lat":45.400104,"lng":-75.626792},{"lat":45.40018,"lng":-75.625686},{"lat":45.400196,"lng":-75.625602}];
    //var denverLatLngs = [{"lat":45.397365,"lng":-75.63671099999999},{"lat":45.397963999999995,"lng":-75.636039},{"lat":45.398651,"lng":-75.635314},{"lat":45.399238,"lng":-75.634689},{"lat":45.399566,"lng":-75.634361}];
    //var line2 = [{"lat":45.290206,"lng":-75.71681199999999},{"lat":45.290279,"lng":-75.716712},{"lat":45.290279,"lng":-75.716712},{"lat":45.290141999999996,"lng":-75.716438},{"lat":45.290096,"lng":-75.716285},{"lat":45.290026999999995,"lng":-75.715812},{"lat":45.289916,"lng":-75.71539299999999},{"lat":45.289787,"lng":-75.71509499999999},{"lat":45.289527,"lng":-75.714698},{"lat":45.28931,"lng":-75.714477},{"lat":45.28931,"lng":-75.714477},{"lat":45.289279,"lng":-75.714553}];
    //L.polyline(denverLatLngs, {color: 'Green'}).addTo(map);
    //L.polyline(line2, {color: 'Red'}).addTo(map);
    //var line = [[45.28750665356019, -75.71488272408745], [45.28829361550474, -75.71396669985496]];
    //L.polyline(line, {color: "Green"}).addTo(map);
}



document.querySelector('#submit').onclick = function (){
    //var temp = document.querySelector('#search-end').value;
    //console.log(temp);
    //create direction object
    var dir = L.mapquest.directions();
    //dont show traffic in directions
    dir.setLayerOptions({
        routeRibbon: {
            showTraffic: false
        }
    });
    getPath(dir, map);
}


//request route and avoid certain linkID
function getPath(dir, map){

    //var arr = [];
    //arr.push(response.linkId);
    //console.log(arr);

    var startInput = document.querySelector('#search-start').value;
    var endInput = document.querySelector('#search-end').value;

    //var startInput = '45.290206, -75.71681199999999';
    //var endInput = '45.289279, -75.714553';
    dir.route({
        start: startInput,
        end: endInput,
        options: {
            routeType: 'pedestrian',
            //mustAvoidLinkIds: arr,
        },
    }, drawRoute);
}

function drawRoute(err, response){
    //console.log(response);


    L.mapquest.directionsLayer({
        directionsResponse: response
    }).addTo(map);
    console.log(response);

    drawLine(response);

    if(DOWNLOAD_ROUTE_FILE){
        var jsontemp = JSON.stringify(response.route.shape.shapePoints);
        savePts(jsontemp, 'pts.txt', 'text/plain');
    }
}

function savePts(content, fileName, contentType){
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

async function parse(){
    var json = require('./copy.json');
    for(var key in json) {
        //console.log(key);
        for (var key1 in json[key]) {
            const sidewalk = {
                id: key,
                sidewalkStatus: json[key][key1],
            };
            await API.graphql(graphqlOperation(createSIDEWALKTABLE, { input: sidewalk }));

            //console.log(json[key][key1]);
        }
    }
}


async function createNewObstruction() {
    const obstruction = {
        lat: "-5",
        lng: "-10",
        linkID: 77,
        type: "A massive tree",
        img: "b64string",
        severity: 1,
    };

    return await API.graphql(graphqlOperation(createOBSTRUCTIONTABLE, { input: obstruction }));
}

async function createNewSidewalk() {
    const sidewalk = {
        id: "P1P2",
        sidewalkStatus: 5,
    };

    return await API.graphql(graphqlOperation(createSIDEWALKTABLE, { input: sidewalk }));
}

async function getObstructions() {
    API.graphql(graphqlOperation(listOBSTRUCTIONTABLES)).then((evt) => {
        evt.data.listOBSTRUCTIONTABLES.items.map((obstruction, i) => {
            QueryResult.innerHTML += `<p>${obstruction.type} - ${obstruction.img}</p>`;
        });
    });
}

async function getSidewalks() {
    API.graphql(graphqlOperation(listSIDEWALKTABLES)).then((evt) => {
        evt.data.listSIDEWALKTABLES.items.map((sidewalk, i) => {
            QueryResult.innerHTML += `<p>${sidewalk.id} - ${sidewalk.sidewalkStatus}</p>`;
        });
    });
}

async function getSidewalkFancy(s) {

    const walkside = {
        id: s,
    };

    var contains = null;

    await API.graphql(graphqlOperation(getSIDEWALKTABLE, walkside)).then((evt) => {
        if(evt.data.getSIDEWALKTABLE != null){
            contains = evt.data.getSIDEWALKTABLE.sidewalkStatus;
        }
    });

    return contains;
}

const MutationButton = document.getElementById("MutationEventButton");
const MutationResult = document.getElementById("MutationResult");
const QueryResult = document.getElementById("QueryResult");

MutationButton.addEventListener("click", (evt) => {
    //parse();


    //console.log(readSidewalk("P1:45.290096,-75.716285_P2:45.290026999999995,-75.715812"));

    //var temp = getSidewalkFancy();
    //console.log(temp);
    /**
     createNewObstruction().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createOBSTRUCTIONTABLE.type} - ${evt.data.createOBSTRUCTIONTABLE.lat}</p>`;
    });
     createNewSidewalk().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createSIDEWALKTABLE.id} - ${evt.data.createSIDEWALKTABLE.sidewalkStatus}</p>`;
    });*/
});

async function readSidewalk(input, pt1, pt2){
    var a;
    const printA = async () => {
        a = await getSidewalkFancy(input);
        console.log(a);
        if(a == 0){ //red
            var line = [pt1, pt2];
            L.polyline(line, {color: "Red"}).addTo(map);
            console.log("RED " + line);
        }else if (a == 1){ //yellow
            var line = [pt1, pt2];
            L.polyline(line, {color: "Yellow"}).addTo(map);
            console.log("YELLOW " + line);
        }else if (a==2) { //green
            var line = [pt1, pt2];
            L.polyline(line, {color: "Green"}).addTo(map);
            console.log("GREEN " + line);
        }else{ //grey
            var line = [pt1, pt2];
            L.polyline(line, {color: "Gray"}).addTo(map);
            console.log("GRAY " + line);
        }
    };


    printA();
    console.log(a);
    return a;
}

//getObstructions();
//getSidewalks();


//========================================================

$(document).ready(function () {
	$('#dialog').dialog({
		title: "Report Obstruction",
		closeText: "X",
		autoOpen: false
	});

})

function addObstr() {
	$('#dialog').dialog("open");
    console.log("hithere")
}
//=========================================================

var hideTextBox
var obstructionsType

//need to wait for the html to finish loading before applying handlers
window.onload = function(){

    obstructionsType = document.getElementById("obstructions");

    hideTextBox = document.getElementById("otherBox");
    //hideTextBox.style.visibility = "hidden";
    hideTextBox.style.display = "none";

    obstructionsType.addEventListener("change", obstruction);
}

function obstruction(){
    if (obstructionsType.options[obstructionsType.selectedIndex].value == "other") {
        //hideTextBox.style.visibility = "visible";
        hideTextBox.style.display = "inline";
    }
    else {
        //hideTextBox.style.visibility = "hidden";
        hideTextBox.style.display = "none";
    }
}