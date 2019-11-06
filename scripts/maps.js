// INDEX.HTML functions

// App uses this array (sorry for the naming, need to fix) to keep track of selected neighborhoods.
var selectedQueue = [];
// console.log("selectedQueue is empty: " + selectedQueue.isEmpty());
var mymap = L.map('mapid');

var geojson = L.geoJSON(cData, {
      style: function (feature) {
        return feature.properties.fillColor;
      },

      onEachFeature: onEachFeature
});

function initializeMap() {
  // Map Container
  // var mymap = L.map('mapid', {
  //   scrollWheelZoom: true
  // }).setView([39.3060, -76.6174], 15);

  mymap.setView([39.3060, -76.6174], 15);

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(mymap);

  geojson.addTo(mymap);

  // Creating Labels
  mymap.createPane('labels');
  mymap.getPane('labels').style.zIndex = 650;
  mymap.getPane('labels').style.pointerEvents = 'none';

  // Make sure the Queue is empty
  emptyStack(selectedQueue);

  //Make sure the UI is blank
  updateUI();
}


function onEachFeature(feature, layer) {
  var label = L.marker(layer.getBounds().getCenter(), {
    icon: L.divIcon({
      className: 'neighborhood-label',
      html: feature.properties.name,
      iconSize: [100, 40]
    })
  }).addTo(mymap);

  // js event handlers
  layer.on({
    click: selectFeature2
  });
}


function selectFeature2(e) {
  var layer = e.target;

  if(selectedQueue.length < 2) {
    console.log("stack length < 2");
    toggleSelected(layer);
    selectedQueue.push(layer);
  } else if(selectedQueue.length == 2) {
    console.log("stack length == 2: " + selectedQueue[0].feature.properties.name + " & " + selectedQueue[1].feature.properties.name);

    //Empty Stack
    for (var i = 1; i < selectedQueue.length && i >= 0; i--) {
      console.log("Stack Length (emptying): " + selectedQueue.length);
      toggleSelected(selectedQueue[i]);
      selectedQueue.pop();
    }

    console.log("Stack is empty, yes? " + selectedQueue.length);

    // Add selected layer
    selectedQueue.push(layer);
    toggleSelected(layer);
    console.log("Stack now contains: " + selectedQueue.length );
    // + " & " + selectedQueue[1].feature.properties.name selectedQueue[0].feature.properties.name
  }

  updateUI();
}


function emptyStack(stack) {
  // console.log(stack);
  // console.log("Stack to be emptied length is: " + stackItem.length;

  for (var i = 0; i < stack.length; i++) {
    var deselect = stack.pop();
    console.log("Pop: " + deselect.feature.properties.name);
    toggleSelected(deselect);
  }

}

function toggleSelected(layer) {
  //Toggle selected property
  // Toggle selected Style
  if(layer.feature.properties.selected == true){ // Deselect Layer
    console.log("Deselecting: " + layer.feature.properties.name);
    geojson.resetStyle(layer);
    layer.feature.properties.selected = false;
  } else { // Select Layer
    // change style
    layer.setStyle({
      fillColor: `#800026`,
      fillOpacity: 0.7
    });
    layer.feature.properties.selected = true;
  }
}

function updateUI() {

  // Add Elements
  if(selectedQueue.length == 0) {
    // Clear Elements
    // location 1
    document.getElementById("loc-1").innerHTML = "";
    document.getElementById("loc-1-population").innerHTML = "";
    document.getElementById("loc-1-population-label").innerHTML = "";

    // location 2
    document.getElementById("loc-2").innerHTML = "";
    document.getElementById("loc-2-population").innerHTML = "";
    document.getElementById("loc-2-population-label").innerHTML = "";

    // Compare button
    document.getElementById("compare-button").style.display = "none";
    document.getElementById("location-divider").style.display = "none";

  } else if(selectedQueue.length == 1) {
    document.getElementById("loc-1").innerHTML = selectedQueue[0].feature.properties.name;
    document.getElementById("loc-1-population").innerHTML = selectedQueue[0].feature.properties.population;
    document.getElementById("loc-1-population-label").innerHTML = "Population";
  } else {
    document.getElementById("loc-1").innerHTML = selectedQueue[0].feature.properties.name;
    document.getElementById("loc-1-population").innerHTML = selectedQueue[0].feature.properties.population;
    document.getElementById("loc-1-population-label").innerHTML = "Population";

    document.getElementById("loc-2").innerHTML = selectedQueue[1].feature.properties.name;
    document.getElementById("loc-2-population").innerHTML = selectedQueue[1].feature.properties.population;
    document.getElementById("loc-2-population-label").innerHTML = "Population";

    // Show Compare Button
    document.getElementById("compare-button").style.display = "block";
    document.getElementById("location-divider").style.display = "block";
  }

  // layer.feature.properties.name;
}
// push to array, check length of array, js shift

//Location stuff
// mymap.locate({setView: true, maxZoom: 16});
//
// mymap.on('locationfound', onLocationFound);
//
//

function onLocationFound(e) {
	var radius = e.accuracy;

	// L.marker(e.latlng).addTo(mymap)
	// 	.bindPopup("You are within " + radius + " meters from this point").openPopup();
  //
	// L.circle(e.latlng, radius).addTo(mymap);
}


// FILTER PAGE
function sendToFilterPage() {
  console.log("HELLO sendToFilterPage: " + selectedQueue.length);

  if(selectedQueue.length == 1) {
    sessionStorage.setItem('loc-1', JSON.stringify(selectedQueue[0].feature));
    console.log(selectedQueue[0]);
  } else if(selectedQueue.length == 2) {
    sessionStorage.setItem('loc-1', JSON.stringify(selectedQueue[0].feature));
    sessionStorage.setItem('loc-2', JSON.stringify(selectedQueue[1].feature));
    console.log(selectedQueue[0]);
    console.log(selectedQueue[1]);
  } else {}

  document.location.href='filter.html';
}

function loadFilterPage() {
  console.log("Load Filter Page for: " + JSON.parse(sessionStorage.getItem('loc-1')).properties.name + " & " + JSON.parse(sessionStorage.getItem('loc-2')).properties.name);
  // console.log("HELLO FILTER PAGE. SelectedQueue is: " + JSON.parse(sessionStorage.getItem('loc-1').feature.properties.name));
  // Populate Selection dropdown
  populateDropdown(document.getElementById('sel1'));

  addNeighborhood();

  document.getElementById("sel1").value = JSON.parse(sessionStorage.getItem('loc-1')).properties.name;
  document.getElementById("loc-2").value = JSON.parse(sessionStorage.getItem('loc-2')).properties.name;

}


function populateDropdown(element) {
  var jsonFeatures = cData.features;
  var addedHTML = "<option selected>Choose</option>";

  for (var i = 0; i < jsonFeatures.length; i++) {
    addedHTML += "<option>" + jsonFeatures[i].properties.name; + "</option>";
  }

  element.innerHTML = addedHTML;

  // console.log(Object.keys(cData).length);

}

function addNeighborhood() {
  document.getElementById("loc-2").style.display = "block";
  populateDropdown(document.getElementById('sel2'));
}

function changeSelected() {
  // console.log("Selected is: " + $(this).children("option:selected").text());
}


function saveValues() {
  // Add Neighborhood 1 to selectedQueue
  // if() {
  //
  // }
  var neighborhood1 = document.getElementById("sel1").selectedIndex;
  console.log(document.getElementsByTagName("option")[neighborhood1].value);


}

// COMPARE.HTML FUNCTIONS
function compareLoad() {
  // Change page title
  window.document.title = "Compare " + JSON.parse(sessionStorage.getItem('loc-1')).properties.name + " & " + JSON.parse(sessionStorage.getItem('loc-2')).properties.name;

  // Change Header Title

  // Load Cards
  populateCards();
}

function sendToComparePage() {
  document.location.href = "compare.html";
}

function populateCards() {
  createPopulationCard();
}

function createPopulationCard() {
  var populationGraph = document.getElementById("population");
  var ctx = populationGraph.getContext('2d');

  var data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [{
      // label: "Stock A",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(225,0,0,0.4)",
      borderColor: "red", // The main line color
      borderCapStyle: 'square',
      borderDash: [], // try [5, 15] for instance
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "black",
      pointBackgroundColor: "white",
      pointBorderWidth: 1,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: "yellow",
      pointHoverBorderColor: "brown",
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHitRadius: 10,
      // notice the gap in the data and the spanGaps: true
      data: [65, 59, 80, 81, 56, 55, 40, ,60,55,30,78],
      spanGaps: true,
     }


  ]
};

// Notice the scaleLabel at the same level as Ticks
var options = {
  scales: {
    yAxes: [{
      gridLines: {
        drawBorder: false,
      },
    }],
    xAxes: [{
      gridLines: {
        display: false,
      },
    }],
  },
  legend: {
    display: false
  }
};

// Chart declaration:
var populationChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});
}





// CODE GRAVEYARD

// [-76.6174, 39.3060],
// [-76.616387, 39.306535],
// [-76.617621, 39.306518],
// [-76.617503, 39.305538]


// [-76.6174, 39.3060],
// [-76.616387, 39.306535],
// [-76.617621, 39.306518],
// [-76.617503, 39.305538]

// function onEachFeature(feature, layer) {
//   var popupContent = "<p>I started out as a GeoJSON " +
//       feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
//
//   if (feature.properties && feature.properties.popupContent) {
//     popupContent += feature.properties.popupContent;
//   }
//
//   layer.bindPopup(popupContent);
// }

// function selectFeature(e) {
//   var layer = e.target;
//
//   // console.log("Stack Length before switch is: " + selectedQueue.length);
//
//   // Check stack length. If ==2, pop, then push. if less than 2 push
//   if(selectedQueue.length < 2) {
//     console.log("Selecting First layer!");
//     toggleSelected(layer);
//
//     // Push it onto the stack
//     selectedQueue.push(layer);
//
//     // console.log("Stack Length is: " + selectedQueue.length);
//   } else if(selectedQueue.length == 2) {
//     // Pop off and deselect the feature
//     var deselectFeature = selectedQueue.pop();
//     console.log("Deselected Feature: " + deselectFeature.feature.properties.name);
//     toggleSelected(deselectFeature);
//
//     // Push new layer onto stack
//     toggleSelected(layer);
//     selectedQueue.push(layer);
//   }
//
//   // layer.cData.features.properties.selected
//   // console.log("Name is: " + layer);
//   // console.log(layer);
//
//   updateUI();
//
//
//     //
//     // // Set selected to true
//     // layer.feature.properties.selected = true;
//
//
//   // Check which layer is selected
//   // console.log(layer.feature.properties.name + ":" + layer.feature.properties.selected);
//
// }

// Bibliography
// https://leafletjs.com/reference-1.5.0.html#map-wheelpxperzoomlevel
//

/* geoJSON
https://tools.ietf.org/html/rfc7946#page-15
https://leafletjs.com/examples/geojson/
*/

/* Javascript Events
https://stackoverflow.com/questions/7723188/what-properties-can-i-use-with-event-target
https://www.w3schools.com/jsref/event_target.asp
https://eloquentjavascript.net/15_event.html
https://stackoverflow.com/questions/25678015/how-does-leaflet-understand-parameter-e-in-the-chloropleth-tutorial
*/
