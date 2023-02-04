//Part 1 : Leaflet Earthquake visualisation

// Creating the base layers for the visualisation.

//Street layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})


//topography layer
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



// Creating baseMaps object.
var baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};


//defininf  object
var myMap = L.map("map", {
  center: [-0, -0],
  zoom: 3,
  layers: [street]
});


//creating ledgend
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


//adding ledgend to the map
legend.addTo(myMap);



// controlling the layers
L.control.layers(baseMaps, {}).addTo(myMap);

  
// tile layer
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

// API Q and URL
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var url = baseURL;


  
// use of d3 to get the data
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

    // Adding circles, coord to the map.
    var coords = [earthquakes[i].geometry.coordinates[1],earthquakes[i].geometry.coordinates[0]];
    
      
      
      
    var size = earthquakes[i].properties.mag * 50000;

    L.circle(coords, {
      fillOpacity: 0.5,
      color: "white",
      fillColor: color,
     
        // Adjusting the radius.
      radius: size
    }).bindPopup(`<h1>${earthquakes[i].properties.place}</h1> <hr> <h3>Magnitute: ${earthquakes[i].properties.mag}</h3><hr> <h3>Depth: ${earthquakes[i].geometry.coordinates[2]}</h3>`).addTo(myMap);
  }
});



//Plotting the tectonic plates
var tectonic_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonic_url).then(function(response){
  console.log("read in url");
  console.log(response)
  L.geoJson(response, {
    color: "#2e7de6",
    weight: 2
  }).addTo(myMap)
});
  
