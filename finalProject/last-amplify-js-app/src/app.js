import Amplify, { API, graphqlOperation } from "aws-amplify";

import awsconfig from "./aws-exports";
import { createOBSTRUCTIONTABLE } from "./graphql/mutations";
import { createSIDEWALKTABLE } from "./graphql/mutations";
import { getSIDEWALKTABLE, listOBSTRUCTIONTABLES } from "./graphql/queries";
import { listSIDEWALKTABLES } from "./graphql/queries";
//import json from "./DeepLab.json";

Amplify.configure(awsconfig);

let CLICK_TO_ADD_MARKER = true;
let DOWNLOAD_ROUTE_FILE = false;
let ADDED_LINK = null;
getObstructionIds();

var dir;

obstructionsType = document.getElementById("obstructions");

hideTextBox = document.getElementById("otherBox");
//hideTextBox.style.visibility = "hidden";
hideTextBox.style.display = "none";

obstructionsType.addEventListener("change", obstruction);

placeSearch({
    key: '==INSERT MAPQUEST API KEY==',
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
    key: '==INSERT MAPQUEST API KEY==',
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
L.mapquest.key = '==INSERT MAPQUEST API KEY==';

//create map
var map = L.mapquest.map('map', {
    center: [45.284501916919176, -75.7155364751816],
    layers: L.mapquest.tileLayer('map'),
    zoom: 14
});

// boolean for if obstructions should be avoided
var avoid;

var layerGroup = L.layerGroup().addTo(map);
var curMark;
var directionsGroup = L.layerGroup().addTo(map);
var line_map = L.layerGroup().addTo(map);

if(CLICK_TO_ADD_MARKER){
    map.on('click', addMarker);
}


function addMarker(e){
    // Add marker to map at click location; add popup window
    layerGroup.clearLayers();

    var newMarker = new L.marker(e.latlng).bindPopup('<button id="obstr">Report Obstruction</button><br><button id="setstart" style ="background-color:#34ba83;">Set As Start</button><br><button id="setend" style ="background-color:#ba3434;">Set As End</button>').addTo(map);
    newMarker.on("click", function (event){
        document.getElementById("obstr").addEventListener("click", addObstr);
        document.getElementById("setstart").addEventListener("click", setStart);
        document.getElementById("setend").addEventListener("click", setEnd);
        document.getElementById("coord").value = e.latlng.lat + "," + e.latlng.lng;
        getLinkID(document.getElementById("coord").value.split(",")[0], document.getElementById("coord").value.split(",")[1]);
        curMark = e.latlng;
    });

    newMarker.addTo(layerGroup);
    console.log("Marker added at : " + e.latlng);
}

function formatPts(p1, p2,round=false){
    try {
        if(round == true){
            var str = "P1:" + p1.lat.toFixed(6) + "," + p1.lng.toFixed(6) + "_P2:" + p2.lat.toFixed(6) + "," + p2.lng.toFixed(6);
        }else{
            var str = "P1:" + p1.lat + "," + p1.lng + "_P2:" + p2.lat + "," + p2.lng;
        }

    } catch (error) {
        console.log(p1)
        console.log("Man that is one bad cord...")
    }

    return str;
}

var greenCur;
var redCur;
var yellowCur;
var greyCur;


function drawLine(input){

    //reset the percent trackers
    document.getElementById("withside").innerHTML = "0";
    document.getElementById("green").innerHTML = "0";
    document.getElementById("yellow").innerHTML = "0";
    document.getElementById("red").innerHTML = "0";
    var totalDis = [0,0];

    greenCur = 0;
    redCur = 0;
    yellowCur = 0;
    greyCur = 0;


    var arr = input.route.shape.shapePoints
    //console.log(arr);
    for(let pt1 = 0; pt1 < arr.length; pt1++){
        //console.log(pt1 + " " + arr[pt1])
        try{
            //console.log(arr[pt1]);
            //console.log(arr[pt1+1].lat)
            //var line = [arr[pt1], arr[pt1+1]];
            readSidewalk(formatPts(arr[pt1], arr[pt1+1]),formatPts(arr[pt1], arr[pt1+1],true), arr[pt1], arr[pt1+1]);
            totalDis[0] = totalDis[0] + Math.abs(arr[pt1].lat - arr[pt1+1].lat);
            totalDis[1] = totalDis[1] + Math.abs(arr[pt1].lng - arr[pt1+1].lng);
            //console.log(col);
        }catch (e) {
            console.log(e);
        }
    }
}



document.querySelector('#submit').onclick = function (){
    //var temp = document.querySelector('#search-end').value;
    //console.log(temp);
    //create direction object
    parse();
    /**
    dir = L.mapquest.directions();

    //dont show traffic in directions
    dir.setLayerOptions({
        routeRibbon: {
            showTraffic: false,
            color: '#ff0000'
        }
    });


    getPath(dir, map);
     */
}

var links = [];
async function getObstructionIds() {
    API.graphql(graphqlOperation(listOBSTRUCTIONTABLES)).then((evt) => {
        evt.data.listOBSTRUCTIONTABLES.items.map((obstruction, i) => {
            links.push(obstruction.linkID)
        });
    });
}


//request route and avoid certain linkID
function getPath(dir, map){
    console.log(links);
    var startInput = document.querySelector('#search-start').value;
    var endInput = document.querySelector('#search-end').value;

    //var startInput = '45.290206, -75.71681199999999';
    //var endInput = '45.289279, -75.714553';
    //var t = [3740643, 32200732];
    if(!avoid){
        for(var k = 0; k < links.length; k++){
            links.pop();
        }
    }
    dir.route({
        start: startInput,
        end: endInput,
        options: {
            routeType: 'pedestrian',
            mustAvoidLinkIds: links,
        },
    }, drawRoute);
}

function drawRoute(err, response){
    console.log("$$$$$$$$$$$$$$$$$" + err);

    directionsGroup.clearLayers();
    L.mapquest.directionsLayer({
        directionsResponse: response
    }).addTo(directionsGroup);
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
            //parse_sidewalk_id(key,json[key][key1])

            await API.graphql(graphqlOperation(createSIDEWALKTABLE, { input: sidewalk }));

            //console.log(json[key][key1]);
        }
    }
}


function check_sev() {
    var severity_num;
    if(document.getElementById("sev1").checked){
        severity_num = 1;
    }
    else if (document.getElementById("sev2").checked){
        severity_num = 2;
    }
    else if (document.getElementById("sev3").checked){
        severity_num = 3;
    }
    return severity_num
}

async function getLinkID(lat,lng){
    ADDED_LINK = null;
    var directions = L.mapquest.directions();
    directions.findLinkId({
        'lat': lat + 0,
        'lng': lng + 0
    }, findLinkIdCallback);
}

function findLinkIdCallback(error, response) {
    //ADDED_LINK = response.linkId;
    console.log(response.linkId);
    document.getElementById("linkID").innerHTML = response.linkId + "";
    //console.log(response.linkId);
}

async function createNewObstruction(obst) {
    return await API.graphql(graphqlOperation(createOBSTRUCTIONTABLE, { input: obst }));
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
            console.log(obstruction.type);
            //QueryResult.innerHTML += `<p>${obstruction.type} - ${obstruction.linkID}</p>`;
        });
    });
}

async function drawObstructionMarkers() {
    API.graphql(graphqlOperation(listOBSTRUCTIONTABLES)).then((evt) => {
        evt.data.listOBSTRUCTIONTABLES.items.map((obstruction, i) => {
            console.log(obstruction.type + " " + obstruction.lat + "," + obstruction.lng);

            var severity = obstruction.severity;
            var type = obstruction.type;
            var img = obstruction.img;
            var image = new Image();
            image.src = 'data:image/png;base64,' + img;
            var iconSeverity;
            if(severity == 1){
                iconSeverity = "low";
            }else if(severity == 2){
                iconSeverity = "medium";
            }else{
                iconSeverity = "high";
            }
            var date = obstruction.createdAt;

            const dateTime = date.split("T")
            date = dateTime[0];
            const time = dateTime[1].split(":");
            var timeString = time[0] + ":" + time[1] + " (UTC)";

            //document.body.appendChild(image);
            //var popUpContent = L.popup().setContent("<h2>" + type + "</h2><br />" + "<img src=" + image.src + " width=\"100\" height=\"100\">");
            var popUpContent = L.popup().setContent("<h2>" + type + "</h2><br />" + "<img src=" + image.src + " width=\"100\" height=\"100\"> <br /><h2> Date Reported: " + date + "</h2>" + "<br /><h2> Time Reported: " + timeString + "</h2>");
            L.marker([obstruction.lat, obstruction.lng], {
                icon: L.mapquest.icons.incident({
                    size: 'sm',
                    severity: iconSeverity,
                }),
                draggable: false,
            }).bindPopup(popUpContent).addTo(map);

        });
    });
}

function parse_sidewalk_id(sidewalk_id,sidewalkStatus){
    const cords = sidewalk_id.split("_",2);

    var cord_1 = cords[0].replace("P1:","").split(",");
    var cord_2 = cords[1].replace("P2:","").split(",");

    var cord_1_L = new L.LatLng(parseFloat(cord_1[0]), parseFloat(cord_1[1]));
    var cord_2_L = new L.LatLng(parseFloat(cord_2[0]), parseFloat(cord_2[1]));

    draw_all_sidewalks(cord_1_L,cord_2_L,sidewalkStatus)
}

export const scanTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };

    const scanResults = [];
    const items = 0;
    do{
        items =  await documentClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");

    return scanResults;

};

async function getSidewalks() {
    API.graphql(graphqlOperation(listSIDEWALKTABLES)).then((evt) => {
        evt.data.listSIDEWALKTABLES.items.map((sidewalk, i) => {
            QueryResult.innerHTML += `<p>${sidewalk.id} - ${sidewalk.sidewalkStatus}</p>`;
            //console.log(sidewalk.id)
            //parse_sidewalk_id(sidewalk.id,sidewalk.sidewalkStatus)
        });
    });
}

async function getSidewalkFancy(s,round) {

    const walkside = {
        id: s,
    };

    var contains = null;

    await API.graphql(graphqlOperation(getSIDEWALKTABLE, walkside)).then((evt) => {
        if(evt.data.getSIDEWALKTABLE != null){
            contains = evt.data.getSIDEWALKTABLE.sidewalkStatus;
        }
    });

    const round_wk = {
        id: round,
    };

    var contains_round = null;

    await API.graphql(graphqlOperation(getSIDEWALKTABLE, round_wk)).then((evt) => {
        if(evt.data.getSIDEWALKTABLE != null){
            contains_round = evt.data.getSIDEWALKTABLE.sidewalkStatus;
        }
    });

    return [contains,contains_round];
}

//const MutationButton = document.getElementById("MutationEventButton");
//const MutationResult = document.getElementById("MutationResult");
//const QueryResult = document.getElementById("QueryResult");

/*
MutationButton.addEventListener("click", (evt) => {
    //parse();
    //getLinkID();
    //getSidewalks();
    //drawObstructionMarkers();
    //getObstructions();
    //console.log(readSidewalk("P1:45.290096,-75.716285_P2:45.290026999999995,-75.715812"));

    //var temp = getSidewalkFancy();
    //console.log(temp);

    //createNewObstruction(obstruction1);
    //createNewObstruction(obstruction2);

     createNewObstruction().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createOBSTRUCTIONTABLE.type} - ${evt.data.createOBSTRUCTIONTABLE.lat}</p>`;
    });
     createNewSidewalk().then((evt) => {
        MutationResult.innerHTML += `<p>${evt.data.createSIDEWALKTABLE.id} - ${evt.data.createSIDEWALKTABLE.sidewalkStatus}</p>`;
    });
});
*/

async function readSidewalk(input,round_pts, pt1, pt2){
    var a;
    const printA = async () => {
        var totalRed = [0,0];
        var totalYellow = [0,0];
        var totalBlue = [0,0];
        a = await getSidewalkFancy(input,round_pts);
        console.log(a);
        console.log(pt1)
        if(a[0] == 0 || a[1] == 0){ //red
            var line = [pt1, pt2];
            L.polyline(line, {color: "Red",weight : 8}).addTo(directionsGroup);
            console.log("RED " + line);
            //redCur = parseInt(document.getElementById("red").innerHTML);
            //console.log(redCur);
            redCur = redCur + Math.sqrt(Math.pow(Math.abs(pt1.lat - pt2.lat),2) + Math.pow(Math.abs(pt1.lng - pt2.lng),2));
            //document.getElementById("red").innerHTML = redCur;
        }else if (a[0] == 1 || a[1] == 1){ //yellow
            var line = [pt1, pt2];
            L.polyline(line, {color: "Yellow",weight : 8}).addTo(directionsGroup);
            console.log("YELLOW " + line);
            //console.log(yellowCur);
            //yellowCur = parseInt(document.getElementById("yellow").innerHTML);
            yellowCur = yellowCur + Math.sqrt(Math.pow(Math.abs(pt1.lat - pt2.lat),2) + Math.pow(Math.abs(pt1.lng - pt2.lng),2));
            //document.getElementById("yellow").innerHTML = yellowCur;
        }else if (a[0]==2 || a[1] == 2) { //green
            var line = [pt1, pt2];
            L.polyline(line, {color: "Green",weight : 8}).addTo(directionsGroup);
            //console.log("GREEN " + line);
            //greenCur = parseInt(document.getElementById("green").innerHTML);
            greenCur = greenCur + Math.sqrt(Math.pow(Math.abs(pt1.lat - pt2.lat),2) + Math.pow(Math.abs(pt1.lng - pt2.lng),2));
            //document.getElementById("green").innerHTML = greenCur;
        }else{ //grey
            var line = [pt1, pt2];
            //readSidewalk(formatPts(arr[pt1], arr[pt1+1]), arr[pt1], arr[pt1+1]);
            L.polyline(line, {color: "Gray",weight : 8}).addTo(directionsGroup);
            document.getElementById("grey").innerHTML += pt1 +","+ pt2 + "<br>"
            console.log("GRAY " + line);
            greyCur = greyCur + Math.sqrt(Math.pow(Math.abs(pt1.lat - pt2.lat),2) + Math.pow(Math.abs(pt1.lng - pt2.lng),2));
        }

        //For displaying total sidewalk amount
        console.log("red: " + redCur);
        console.log("yellow: " + yellowCur);
        console.log("green: " + greenCur);
        console.log("grey: " + greyCur);

        var distance = redCur + yellowCur + greenCur + greyCur;
        var withside = (yellowCur + greenCur) / distance;
        document.getElementById("withside").innerHTML = (withside.toFixed(2))*100 + " %";

        var green = greenCur / distance
        document.getElementById("green").innerHTML = green.toFixed(2)* 100 + " %";

        var yellow = yellowCur / distance
        document.getElementById("yellow").innerHTML = yellow.toFixed(2)* 100 + " %";

        var red = redCur / distance
        document.getElementById("red").innerHTML = red.toFixed(2)* 100 + " %";

        var grey = greyCur / distance
        document.getElementById("grey").innerHTML = grey.toFixed(2)* 100 + " %";


    };


    printA();
}

function draw_all_sidewalks(pt1,pt2,a){
    if(a == 0){ //red
        var line = [pt1, pt2];
        L.polyline(line, {color: "Red",weight : 8}).addTo(line_map);
        console.log("RED " + line);
    }else if (a == 1){ //yellow
        var line = [pt1, pt2];
        L.polyline(line, {color: "Yellow",weight : 8}).addTo(line_map);
        console.log("YELLOW " + line);
    }else if (a == 2) { //green
        var line = [pt1, pt2];
        L.polyline(line, {color: "Green",weight : 8}).addTo(line_map);
        console.log("GREEN " + line);
    }
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
}

function setStart() {
    document.querySelector('#search-start').value = curMark.lat + "," + curMark.lng;
}
function setEnd() {
    document.querySelector('#search-end').value = curMark.lat + "," + curMark.lng;
}

var report = document.getElementById("addData");
var image;

report.addEventListener("click", reportObstr);

function reportObstr() {
    getBase64(document.getElementById("myFile").files[0]);
    closeObstr();
}

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {

        const obstruction = {
            lat: document.getElementById("coord").value.split(",")[0],
            lng: document.getElementById("coord").value.split(",")[1],
            linkID: document.getElementById("linkID").innerHTML,
            type: document.getElementById("obstructions").value,
            img: (("hello" + reader.result).split(",")[1]),
            deleteTime: (Math.floor((Date.now() + 432000000) / 1000)),
            severity: check_sev()
        };

        createNewObstruction(obstruction);
    };

    reader.onerror = function (error) {
        console.log("welp") ;
    };
}

function closeObstr() {
    $('#dialog').dialog("close");
}

//=========================================================

var hideTextBox
var obstructionsType
var avoidButton
var ignoreButton

//need to wait for the html to finish loading before applying handlers
window.onload = function(){

    drawObstructionMarkers();

    //on off switch for obstructions
    avoidButton = document.getElementById("avoid");
    ignoreButton = document.getElementById("ignore");
    avoidButton.style.backgroundColor  = "green";
    ignoreButton.style.backgroundColor = "purple";
    avoid = true;

    avoidButton.addEventListener("click", avoiding);
    ignoreButton.addEventListener("click", ignoring);



    obstructionsType = document.getElementById("obstructions");

    hideTextBox = document.getElementById("otherBox");
    //hideTextBox.style.visibility = "hidden";
    hideTextBox.style.display = "none";

    obstructionsType.addEventListener("change", obstruction);

    document.getElementById("withside").innerHTML = "0%";
    document.getElementById("green").innerHTML = "0%";
    document.getElementById("yellow").innerHTML = "0%";
    document.getElementById("red").innerHTML = "0%";
    document.getElementById("grey").innerHTML = "0%";

}

// toggles the highlight and hide buttons and runs the showTags function
function avoiding() {
    avoidButton.style.backgroundColor = "green";
    ignoreButton.style.backgroundColor = "purple";
    avoid = true;
    getObstructionIds();

}

// toggles the highlight and hide buttons and runs the hideTags function
function ignoring() {
    avoidButton.style.backgroundColor = "purple";
    ignoreButton.style.backgroundColor = "green";
    avoid = false;
    if(!avoid){
        for(var k = 0; k < links.length; k++){
            links.pop();
        }
    }
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