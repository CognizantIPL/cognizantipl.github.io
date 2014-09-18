'use strict';
aie.factory('AIEMobileServices', function ($resource, $q, $exceptionHandler, $log) {
    var resource = $resource('https://aiemobileservice.azure-mobile.net/tables/smart_truck_tracker/:id', { id: '@id' },
            {
                'update': {
                    'method': 'PATCH'
                } // adding an update function
            });
    return {
        getTrackingDataForAllTrucks: function () {
            console.log("getTrackingDataForAllTrucks called");
            var deferred = $q.defer();
            resource.query(function (event) {
                deferred.resolve(event);
            },
                function (response) {
                    deferred.reject(response);
                });

            return deferred.promise;
        }

    };
});
