agentApp.controller('AgentController', function AgentController($scope, $log) {
    var azureClient1 = new WindowsAzure.MobileServiceClient('https://aiemobileservice.azure-mobile.net/', 'NYuUVUztAwEXJQZxOFbppximTExpoh26');
    var truckTable = azureClient1.getTable('smart_truck_incident');
    var query = truckTable.where({
        activeIndicator: 1
    }).read().done(function (results) {
        $scope.$apply(function () {
            $scope.Trucks = results;
        });
    }, function (err) {
        alert("Error: " + err);
    });

    var equipTable = azureClient1.getTable('equipment_incident');
    var query1 = equipTable.where({
        activeIndicator: 1
    }).read().done(function (results) {
        $scope.$apply(function () {
            $scope.Equipments = results;
        });
    }, function (err) {
        alert("Error: " + err);
    });
    
});

agentApp.filter('unique', function () {
    return function (input, key) {
        var unique = {};
        var uniqueList = [];
        if (input)
        {
            for (var i = 0; i < input.length; i++) {
            if (typeof unique[input[i][key]] == "undefined") {
                unique[input[i][key]] = "";
                uniqueList.push(input[i]);
             }
            }
        }
      
        return uniqueList;
    };
});

