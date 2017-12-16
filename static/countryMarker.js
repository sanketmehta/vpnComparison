countriesLocation = []

d3.csv("/static/countries.csv", function(data){
    for(var i = 0; i < data.length; i++) {
        country_dict = [{Name: data[i].CountryName,
            LongLat: [data[i].CenterLongitude, data[i].CenterLatitude]}]

            countriesLocation.push(country_dict)        
    }    
})


// Create a map object
var myMap = L.map("map", {
    center: [31.7, -7.09],
    zoom: 3
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ"
).addTo(myMap);


// URL to GET 
var queryURL = "/getColumns";

var shieldIcon = L.icon({
    iconUrl: '../static/favicon.ico',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [50, 50], // size of the shadow
    iconAnchor:   [22, 40], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// Use d3 to send a GET request to return a json
d3.json(queryURL, function(error, response)  {
   var countries = response["Based_in_(Country)"]
   var vpnService = response["VPN_SERVICE"]
   var Jurisdiction = response["Jurisdiction"]
   var monthlyPrice = response["$_/_Month_-_(Annual_Pricing)"]
   var servers = response["#_of_Servers"]
   var countriesDict = {};
   var countryCtr = 0;
   var long = 0.0;
   var lat = 0.0;

    // Loop through array of countries
    for (var i = 0; i<countries.length; i++){      
        // Store each country in a variable address
        var address = countries[i];
        var vpn = vpnService[i];
        var jurisdiction = Jurisdiction[i];
        var price = monthlyPrice[i];
        var server = servers[i];

        // loop through list created from csv
        for(j = 0; j < countriesLocation.length; j++){
            if(address === countriesLocation[j][0].Name){
                if (address in countriesDict) {
                    countriesDict[address] += 1;
                    countryCtr = countriesDict[address];                    
                    // calculate new long lat
                    // even numbers change long
                    // odd numbers change lat
                    if (countryCtr < 5){
                        lat = parseFloat(countriesLocation[j][0].LongLat[1]) - parseFloat(countryCtr*.3);
                        long = parseFloat(countriesLocation[j][0].LongLat[0])  + parseFloat(countryCtr*.5);
                    } else if (countryCtr < 10){                        
                        long = parseFloat(countriesLocation[j][0].LongLat[0]) + parseFloat(countryCtr*.3);
                        lat = parseFloat(countriesLocation[j][0].LongLat[1])  - parseFloat(countryCtr*.5);
                    } else if (countryCtr < 15){                     
                        long = parseFloat(countriesLocation[j][0].LongLat[0]) - parseFloat(countryCtr*.3);
                        lat = parseFloat(countriesLocation[j][0].LongLat[1])  - parseFloat(countryCtr*.5);
                    } else if (countryCtr < 20){                     
                        long = parseFloat(countriesLocation[j][0].LongLat[0]) + parseFloat(countryCtr*.3) + .5;
                        lat = parseFloat(countriesLocation[j][0].LongLat[1])  - parseFloat(countryCtr*.5) + .5;
                    } else {                                           
                        long = parseFloat(countriesLocation[j][0].LongLat[0]) + parseFloat(countryCtr*.2);
                        lat = parseFloat(countriesLocation[j][0].LongLat[1])  - parseFloat(countryCtr*.2) + .5;
                    }
                } else {
                    //use original long lat
                    countryCtr = 1;                   
                    countriesDict[address] = 1;
                    lat = countriesLocation[j][0].LongLat[1];
                    long = countriesLocation[j][0].LongLat[0];
                }

                // create popup contents
                var customPopup = "<h3>" + vpn + "</h3><hr><h6>Country: " 
                      + address + "</h6> <h6>Jurisdiction: " + jurisdiction + "</h6>"                      
                      + "<h6># of Servers: " + server + "</h6>"
                      + "<h6>Price: " + price + "</h6>";
                
                // specify popup options 
                var customOptions =
                    {
                    'maxWidth': '500',
                    'className' : 'custom'
                    }

               // L.marker([lat, long], {icon: shieldIcon})
               // .bindPopup("<h1>" + vpn + "</h1> <hr> <h3>VPN Service: " 
               //        + address + "</h3> <h3>Jurisdiction: " + jurisdiction + "</h3>"
               //        + "<h3>Price: " + price + "</h3>")
               // .addTo(myMap);

               L.marker([lat, long], {icon: shieldIcon})
               .bindPopup(customPopup, customOptions)
               .addTo(myMap);
            }
        }  
    }
})