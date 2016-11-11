/* global L window $*/

L.mapbox.accessToken = "pk.eyJ1IjoiY29zc2F0b3QiLCJhIjoiVGJyMGU5cyJ9.CMKdx74guBSUyyC-L1fAoA";

var map = L.mapbox.map("map", "mapbox.streets-satellite", {
    //minZoom: 5,
    tileLayer: {
        continuousWorld: false,
        noWrap: true
        }
    }).setView([48.103803, -121.965733], 6);

L.control.attribution().addTo(map)
  .addAttribution("CMTs from globalcmt.org; faults from ATA, HimaTibetMap, plate boundaries from Bird 2003");

var beachballs = L.mapbox.featureLayer();
var faultlines = L.mapbox.featureLayer();
beachballs.addTo(map);
faultlines.addTo(map);

addMarkersToMap(map);

map.on("moveend", () => {
  addMarkersToMap(map);
});

function addMarkersToMap(map) {
  addBeachballsToMap(map);
  addFaultlinesToMap(map);
}

function addBeachballsToMap(map) {
  $.when(getQuakesFromDB(map)).done((quakes) => {
    var newBeachballs = L.mapbox.featureLayer();
    quakes.forEach((quake) => {
      newBeachballs.addLayer(
        L.marker(
          [quake.geometry.coordinates[1],
           quake.geometry.coordinates[0]],
          {icon: L.icon(quake.properties.icon)}
        ).bindPopup(quake.properties.title)
      );
    });
    map.removeLayer(beachballs);
    beachballs = newBeachballs;
    map.addLayer(beachballs);
  });
}

function addFaultlinesToMap(map) {
  $.when(getFaultsFromDB(map)).done((faults) => {
    var newFaultlines = L.mapbox.featureLayer();
    faults.forEach((fault) => {
      newFaultlines.addLayer(
        L.geoJson(
          fault,
          {color: "red",
          weight: 1.5,
          opacity: 1}
        )
      );
    });
    map.removeLayer(faultlines);
    faultlines = newFaultlines;
    map.addLayer(faultlines);
  });
}

function getQuakesFromDB(map) {
  var currentBbox = getBboxCoords(map);
  var currentZoom = map.getZoom();
  return $.ajax({
    url: window.location.href + "quakes",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "coordinates" : currentBbox,
      "minZoom" : currentZoom
    })
  });
}

function getFaultsFromDB(map) {
  var currentBbox = getBboxCoords(map);
  return $.ajax({
    url: window.location.href + "faults",
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "coordinates" : currentBbox
    })
  });
}

function getBboxCoords(map) {
  var currentBbox = map.getBounds();
  var northeast = currentBbox.getNorthEast().wrap();
  var southwest = currentBbox.getSouthWest().wrap();
  var coordsArray = [[
    [southwest.lng, southwest.lat],
    [southwest.lng, northeast.lat],
    [northeast.lng, northeast.lat],
    [northeast.lng, southwest.lat],
    [southwest.lng, southwest.lat]]];
  return coordsArray;
}
