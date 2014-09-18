var azureClient = new WindowsAzure.MobileServiceClient('https://aiemobileservice.azure-mobile.net/', 'NYuUVUztAwEXJQZxOFbppximTExpoh26');
var incidentTable = azureClient.getTable('smart_truck_incident');
var deviceTable = azureClient.getTable('app_device');

function deleteItems(jsonData2){
var latitude,longitude;
for(i=0;i<jsonData2.length;++i){
 incidentTable.del({id:jsonData2[i].id});
}
}
function insertIncident(anchorElement) {
    
//incidentTable.where({truck_number: 'T501'}).delete();
var query1 = incidentTable.select('id').where({truck_number: 'T501'}).read().done(function (results) {
            //incdntArray=deleteItems(results);
        }, function (err) {
        });
    setTimeout(insertHardcodedData,5000);
	//alert('Get ready to be teleported! Thanks for supporting Time Travelers!');
	
}

function insertHardcodedData()
{

	var query1 = deviceTable.select('channel').read().done(function (results) {
            incdntArray=insertItems(results);
        }, function (err) {
        	alert(err);
        });	
        
        alert('You have been teleported!');
}


function insertItems(jsonData2)
{
	
	for(i=0;i<jsonData2.length;++i){
		var dataToInsert = {
		    latitude: 41.76432500269802,
		    longitude: -72.67263897064554,
	        speed: 0.0106854487743271,
	        message: "Truck Incident Notification from iOS MapApp",
	        channel: jsonData2[i].channel,
	        truck_number: "T501",
	        address: "700 Main St, Hartford, CT 06103-2934, United States",
	        DateTime: getISODateTime(new Date())};

    		incidentTable.insert(dataToInsert);
	}	
	
}


function getISODateTime(d) {
    // padding function
    var s = function (a, b) { return (1e15 + a + "").slice(-b); };

    // default date parameter
    if (typeof d === 'undefined') {
        d = new Date();
    };

    // return ISO datetime
    return d.getFullYear() + '-' +
        s(d.getMonth() + 1, 2) + '-' +
        s(d.getDate(), 2) + ' ' +
        s(d.getHours(), 2) + ':' +
        s(d.getMinutes(), 2) + ':' +
        s(d.getSeconds(), 2);
}
