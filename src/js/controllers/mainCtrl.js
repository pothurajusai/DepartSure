    app.controller('MainController', function($scope, weatherIO){
        
        $scope.showData = false;
        $scope.searchAirport = function (){

              geocoder.geocode( { 'address': $scope.airportCode}, function(results, status)
              {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    $scope.airportName = results[0].address_components[0].short_name;           
                        weatherIO.getWeather(results[0].geometry.viewport).then(function(data){
                            setData(data);
                            setGoogleMaps(results[0],data);
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
             var skycons = new Skycons({"color": "ORANGE"});
             skycons.add("WeatherIcon", weatherIcon);
             skycons.play();
        }
        
        
        function setGoogleMaps(data, forecastData){

            var Lat = data.geometry.viewport.H.H;
            var Long = data.geometry.viewport.j.H;
            
            var myLatLng = new google.maps.LatLng(Lat,Long);
            

            var map = new google.maps.Map(document.getElementById("map"),
            {
            zoom: 13,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var marker = new google.maps.Marker(
            {
            position: myLatLng,
            map: map,
            title: 'Sai',
            icon: 'src/images/airplane.png'
            });

            var lineSymbol = {
                path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
                rotation: forecastData.data.currently.windBearing,
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
        
            function setData(weatherData){

                   SetupSkyIcon(weatherData.data.currently.icon);
                   $scope.currentTemp = weatherData.data.currently.apparentTemperature;
                   $scope.currentWindSpeed = weatherData.data.currently.windSpeed;
                   $scope.currentWindDirection =  weatherData.data.currently.windBearing;
                   $scope.currentVisibility = weatherData.data.currently.visibility;
                   $scope.showData = true;            
            }

    });
