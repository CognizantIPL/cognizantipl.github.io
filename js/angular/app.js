// app.js

var aie = angular.module('AIE', ['ngResource', 'google-maps']).
    config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-ZUMO-APPLICATION'] = 'NYuUVUztAwEXJQZxOFbppximTExpoh26'; 
        $httpProvider.defaults.headers.common['Content-Type'] = 'Application/json';
    }]);