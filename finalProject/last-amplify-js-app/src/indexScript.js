window.onload = function() {

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


  map.on('click', addMarker);
  drawLine();

  function addMarker(e){
    // Add marker to map at click location; add popup window
    var newMarker = new L.marker(e.latlng).addTo(map);
    console.log(e.latlng);
  }

  function drawLine(){

    var line = [[45.28750665356019, -75.71488272408745], [45.28829361550474, -75.71396669985496]];
    L.polyline(line, {color: "Green"}).addTo(map);

    //,,,{"lat":45.399566,"lng":-75.634361},{"lat":45.399822,"lng":-75.630828},{"lat":45.399864,"lng":-75.630241},{"lat":45.399887,"lng":-75.62986699999999},{"lat":45.399921,"lng":-75.629364},{"lat":45.400104,"lng":-75.626792},{"lat":45.40018,"lng":-75.625686},{"lat":45.400196,"lng":-75.625602}];
    //var denverLatLngs = [{"lat":45.397365,"lng":-75.63671099999999},{"lat":45.397963999999995,"lng":-75.636039},{"lat":45.398651,"lng":-75.635314},{"lat":45.399238,"lng":-75.634689},{"lat":45.399566,"lng":-75.634361}];
    //var line2 = [{"lat":45.399566,"lng":-75.634361},{"lat":45.399822,"lng":-75.630828},{"lat":45.399864,"lng":-75.630241},{"lat":45.399887,"lng":-75.62986699999999},{"lat":45.399921,"lng":-75.629364},{"lat":45.400104,"lng":-75.626792},{"lat":45.40018,"lng":-75.625686},{"lat":45.400196,"lng":-75.625602}];
    //L.polyline(denverLatLngs, {color: 'Green'}).addTo(map);
    //L.polyline(line2, {color: 'Red'}).addTo(map);
  }



  document.querySelector('#submit').onclick = function (){
    var temp = document.querySelector('#search-end').value;
    console.log(temp);
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

}

//request route and avoid certain linkID
function getPath(dir, map){

  //var arr = [];
  //arr.push(response.linkId);
  //console.log(arr);

  var startInput = document.querySelector('#search-start').value;
  var endInput = document.querySelector('#search-end').value;
  dir.route({
    start: startInput,
    end: endInput,
    options: {
      routeType: 'pedestrian',
      //mustAvoidLinkIds: arr,
    },
  });
}
