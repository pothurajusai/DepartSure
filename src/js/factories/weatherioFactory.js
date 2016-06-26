app.factory('weatherIO', function($http,$q, APIKEY){
     return{
        getWeather : function(LatLongObject){

            var latitude = LatLongObject.f.b;
            var longitude = LatLongObject.b.b;

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
