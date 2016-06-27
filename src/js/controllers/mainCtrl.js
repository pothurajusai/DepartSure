    app.controller('MainController', function($scope, weatherIO){

        $scope.showData = false; //Initially set to false. Controls the weather metrics display.
        $scope.searchAirport = function (){

              geocoder.geocode( { 'address': $scope.airportCode}, function(results, status)
              {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    $scope.airportName = results[0].address_components[0].short_name; //Sets the airport name (Or whatever location the maps api returns).
                        weatherIO.getWeather(results[0].geometry.viewport).then(function(data){
                            setData(data); //Sets the data of all the weather metrics.
                            setGoogleMaps(results[0],data); //Sets the google maps position.
                        }, function(err){
                            alert(err);
                        });
                }
                else
                {
                alert("Geocode was not successful for the following reason: " + status);
                }
        });

        }

        function SetupSkyIcon(weatherIcon){
             var skycons = new Skycons({"color": "ORANGE"}); //Color of the Skycon can be changed here.
             skycons.add("WeatherIcon", weatherIcon); // Initialize the weather icon.
             skycons.play(); //Starts playing the animated weather icon. 
        }


        function setGoogleMaps(data, forecastData){

            var Lat = data.geometry.viewport.f.b; //Latitude property returned from the Google Maps API.
            var Long = data.geometry.viewport.b.b; //Longitude property returned from the Google Maps API.

            var LatLongObj = new google.maps.LatLng(Lat,Long); 


            var map = new google.maps.Map(document.getElementById("map"),
            {
            zoom: 13,
            center: LatLongObj,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            //Plane on the map.
            var marker = new google.maps.Marker(
            {
            position: LatLongObj,
            map: map,
            title: 'Plane',
            icon: 'src/images/airplane.png'
            });

            //Arrow which points in the direction of the wind.
            var lineSymbol = {
                path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                rotation: forecastData.data.currently.windBearing, //Wind direction.
                anchor: new google.maps.Point(0,7)
            };


            var line = new google.maps.Polyline({
             path: [{lat: Lat, lng: Long}, {lat: Lat, lng: Long}],
                icons: [{
                icon: lineSymbol,
                offset: '100%'
                 }],
                 map: map
                });
            }

            //Sets the weather metrics.
            function setData(weatherData){
                   SetupSkyIcon(weatherData.data.currently.icon);
                   $scope.currentTemp = weatherData.data.currently.apparentTemperature;
                   $scope.currentWindSpeed = weatherData.data.currently.windSpeed;
                   $scope.currentWindDirection =  weatherData.data.currently.windBearing;
                   $scope.currentVisibility = weatherData.data.currently.visibility;
                   $scope.precipProbability = Math.round((weatherData.data.currently.precipProbability) * 100);
                   $scope.showData = true;
            }

    });
