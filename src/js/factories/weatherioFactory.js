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


