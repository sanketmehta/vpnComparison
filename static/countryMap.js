// Check whether countryMap route is working
console.log("map loaded")

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
  });
  var geocoder = new google.maps.Geocoder();
  geocodeAddress(geocoder, map);
}

function geocodeAddress(geocoder, resultsMap) {
  
  // URL to GET 
  var queryURL = "/getColumns"

  // Use d3 to send a GET request to return a json
  d3.json(queryURL, function(error, response) {
    if (error) return console.warn(error);
    console.log(response["Based_in_(Country)"]);
    // console.log(response["VPN_SERVICE)"]);

    // Traversing the JSON to get countries and store in array
    var countries = response["Based_in_(Country)"]
    var vpnService = response["VPN_SERVICE"]

    // Loop through array of countries
    for (var i = 0; i<10; i++){
      // console.log(countries[i])
    
          // Store each country in a variable address
          var address = countries[i]
          var vpn = vpnService[i]
          console.log(address)
          console.log(vpn)

          // Geocode each address
          geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
              resultsMap.setCenter(results[0].geometry.location);

              var contentString = "<h1>"+vpn+"</h1>"
              var infowindow = new google.maps.InfoWindow({
                content: contentString
              });

              // Set a marker and plot each address
              var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                // title: "Hey there"              
              });
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      })
  }