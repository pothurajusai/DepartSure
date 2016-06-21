    var app = angular.module('app', []).config(function(){
        geocoder = new google.maps.Geocoder();
    }).constant("APIKEY", " "); //Add your own API Key for forecast.io here.
