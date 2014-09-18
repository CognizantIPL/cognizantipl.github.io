'use strict';
var _trucks_in_Map = [];
var mapOptions = {
    zoom: 19,
    center: new google.maps.LatLng(41.765174, -72.672154),
    mapTypeId: google.maps.MapTypeId.HYBRID
};
var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

aie.controller('AIETrucksController', function AIETrucksController($scope, $timeout, $log, AIEMobileServices) {
    google.maps.visualRefresh = true;

    AIEMobileServices.getTrackingDataForAllTrucks().then(function (result) {
        var marker, i, markerImage, infowindow = new google.maps.InfoWindow();
        for (var i = 0; i < result.length; i++) {
            _trucks_in_Map[i] = result[i].truck_number;
            markerImage = new google.maps.MarkerImage(
                             'http://aiewireframe.azurewebsites.net/img/darkgreen_MarkerA.png',
                             new google.maps.Size(20, 34), //size
                             null, //origin
                             null, //anchor
                             new google.maps.Size(20, 34) //scale
                             );

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(result[i].latitude, result[i].longitude),
                map: map,
                title: result[i].address,
                icon: markerImage
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(result[i].truck_number);
                    infowindow.open(map, marker);
                }
            })(marker, i));
        };

        if (_trucks_in_Map && _trucks_in_Map.length > 0) {
            var temp = ArrNoDupe(_trucks_in_Map);
            for (var a = 0; a <= temp.length - 1; a++) {
                ReadTruckIncident(temp[a]);
            }
        }
    });

});

function ArrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}


function ReadTruckIncident(truck_number) {
    var azureClient1 = new WindowsAzure.MobileServiceClient('https://aiemobileservice.azure-mobile.net/', 'NYuUVUztAwEXJQZxOFbppximTExpoh26');
    var truckTable = azureClient1.getTable('smart_truck_incident');
    var query = truckTable.where({
        truck_number: truck_number
    }).read().done(function (results) {
        MakeTheIncidentTruckRed(results);
    }, function (err) {
        alert("Error: " + err);
    });
}

function MakeTheIncidentTruckRed(trucks) {
    var marker, infowindow = new google.maps.InfoWindow();
    for (var i = 0; i < trucks.length; i++) {
        if (trucks[i].activeIndicator === null || trucks[i].activeIndicator === 1) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(trucks[i].latitude, trucks[i].longitude),
                map: map,
                title: trucks[i].address,
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    var anchorElem = document.createElement('a');
                    var yourLink = 'http://aiewireframe.azurewebsites.net/crashreport.html?user=insured&vehicleNo=' + trucks[i].truck_number;
                    anchorElem.setAttribute("href", yourLink);
                    anchorElem.innerHTML = trucks[i].truck_number;
                    infowindow.setContent(anchorElem);
                    infowindow.open(map, marker);
                }
            })(marker, i));

        }
        break;
    }
}

