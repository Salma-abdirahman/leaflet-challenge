// Leaflet Part 1: Earthquake visualisation


// Creating the base layers.

//Streetmap
var streetM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

//topographic
var topoM = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// satellite map 
var satM = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});



// Create a baseMaps object.
var baseMaps = {
  "Street Map": streetM,
  "Topographic Map": topoM,
  "Satellite Map": satM
};


// Defining map object.
var myMap = L.map("map", {
  center: [-0, -0],
  zoom: 3,
  layers: [street]
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];


    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br><br>' : '+');
    }

    return div;
};

//Ledgend for the map
legend.addTo(myMap);


// Layer control
L.control.layers(baseMaps, {}).addTo(myMap);

  
//tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function getColor(d) {
  return d > 1000 ? '#800026' :
          d > 500  ? '#BD0026' :
          d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
          d > 50   ? '#FD8D3C' :
          d > 20   ? '#FEB24C' :
          d > 10   ? '#FED976' :
                    '#FFEDA0';
};

// API Query
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// API query url.
var url = baseURL;


  
//D3.
d3.json(url).then(function(response) {
 
  var earthquakes = response.features;
  for (var i = 0; i < earthquakes.length; i++) {
    if (earthquakes[i].properties.mag < 0){
      console.log("negative magnitude, skipping");
      continue;
    };

    
    var depth = earthquakes[i].geometry.coordinates[2];
    var color = getColor(depth);
    console.log(depth);

    // Adding circles
    var coords = [earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]];
 
      
    var size = earthquakes[i].properties.mag * 50000;

    L.circle(coords, {
      fillOpacity: 0.5,
      color: "black",
      fillColor: color,
      // Adjusting radius.
      radius: size
    }).bindPopup(`<h1>${earthquakes[i].properties.place}</h1> <hr> <h3>Magnitute: ${earthquakes[i].properties.mag}</h3><hr> <h3>Depth: ${earthquakes[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
  }
});

//plotting tectonic plates on top of data

var tectonic_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonic_url).then(function(response){
  console.log("read in url");
  console.log(response)
  L.geoJson(response, {
    color: "#FF0000",
    weight: 2
  }).addTo(myMap)
});