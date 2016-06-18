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
         templateUrl: 'src/views/weathericon.html'  
       };
    });

    app.directive('weatherData', function(){
        return{
            templateUrl:'src/views/data.html'
        };
    });

    app.controller('MainController', function($scope, weatherIO){
        
        $scope.gotData = false;
        $scope.searchAirport = function (){

              geocoder.geocode( { 'address': $scope.airportCode}, function(results, status)
              {
                if (status == google.maps.GeocoderStatus.OK)
                {

                    $scope.airportName = results[0].address_components[0].short_name;
                        weatherIO.getWeather(results[0].geometry.viewport).then(function(data){

                            SetupSkyIcon(data.data.currently.icon);

                             $scope.currentTemp = data.data.currently.apparentTemperature;
                             $scope.currentWindSpeed = data.data.currently.windSpeed;
                             $scope.currentWindDirection =  data.data.currently.windBearing;
                             $scope.currentVisibility = data.data.currently.visibility;
                            
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
             var skycons = new Skycons({"color": "WHITE"});
             skycons.add("WeatherIcon", weatherIcon);
             skycons.play();
        }

    });
