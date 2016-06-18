    var app = angular.module('app', []).config(function(){
        geocoder = new google.maps.Geocoder();
    }).constant("APIKEY", "50032743e663e9f8b1de11ad23cca007");

    app.factory('weatherIO', function($http,$q, APIKEY){
       return{
           getWeather : function(LatLongObject){

            var latitude = LatLongObject.H.H;
             var longitude = LatLongObject.j.H;  

            var deffered = $q.defer();  

               $http.get('https://api.forecast.io/forecast/'+APIKEY+'/'+latitude+','+ longitude +'').then(function(data){
                   deffered.resolve(data);
                 }, function(error){
                 deffered.reject(error);
             });
               return deffered.promise;
           }
       }; 
    });

    app.directive('weatherIcon',function(){
       return{
         templateUrl: 'src/js/directives/views/weatherIcon.html'  
       };
    });

    app.directive('weatherData', function(){
        return{
            templateUrl:'src/js/directives/views/data.html'
        };
    });

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
        
            function setData(weatherData){

                   SetupSkyIcon(weatherData.data.currently.icon);
                   $scope.currentTemp = weatherData.data.currently.apparentTemperature;
                   $scope.currentWindSpeed = weatherData.data.currently.windSpeed;
                   $scope.currentWindDirection =  weatherData.data.currently.windBearing;
                   $scope.currentVisibility = weatherData.data.currently.visibility;
                   $scope.showData = true;            
            }

    });
