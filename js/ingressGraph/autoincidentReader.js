function readIncidentTable()
{
var vehicleNo = getDetails();
var azureClient1 = new WindowsAzure.MobileServiceClient('https://aiemobileservice.azure-mobile.net/', 'NYuUVUztAwEXJQZxOFbppximTExpoh26');
var equipTable= azureClient1.getTable('smart_truck_incident');
var query1 = equipTable.where({truck_number: vehicleNo}).read().done(function (results) {
            incdntArray=readArrayItems(results,vehicleNo);
        }, function (err) {
        });
}

function getDetails(){
  var vehicleNo = document.URL.split('vehicleNo=')[1];
  var userdetail = document.URL.split('user=')[1];
  var user = userdetail.split("&")[0];
  if(user=="insured"){
    document.getElementById("process").style.visibility="hidden";
    document.getElementById("reject").style.visibility="hidden";
    document.getElementById("tow_truck").style.visibility="hidden";
    document.getElementById("truck_header").style.visibility="hidden";
    document.getElementById("accordion_policy").style.visibility="hidden";
	document.getElementById("accordion_policy").style.height="0px";
 
  }else{
    document.getElementById("request").style.visibility="hidden";
    document.getElementById("cancel").style.visibility="hidden";	
	$("#contact_details").html('<table><tr><td><b>Policy Holder contact</b></td><td id="address" value=""> <a href="tel:+(860)-818-9999" style="color:blue">Call Steve</a> </td></tr><tr><td><b>Omega Insurance Claim Dept.</b></td><td id="address" value=""> <a href="tel:+1-800-277-9878" style="color:blue">Call</a> </td></tr></table>');
  }
  return vehicleNo;
}

function readArrayItems(jsonData2, vehicleNo){
var latitude,longitude;
for(i=0;i<jsonData2.length;++i){
  if(jsonData2[i].truck_number == vehicleNo){
   /* alert(jsonData2[i+1].id);
    alert(!(jsonData2[i].id<jsonData2[i+1].id));
    if(!(jsonData2[i].id<jsonData2[i+1].id))
    {*/
    if (document.getElementById("veh_id").value!=''){
document.getElementById("veh_id").value = document.getElementById("veh_id").value+','+jsonData2[i].id;}
else
{document.getElementById("veh_id").value = jsonData2[i].id;}
if (document.getElementById("channel").value!=''){
document.getElementById("channel").value = document.getElementById("channel").value+','+jsonData2[i].channel;}
else
{document.getElementById("channel").value = jsonData2[i].channel;}
 
    document.getElementById("trucknumber").innerHTML = jsonData2[i].truck_number;
latitude=jsonData2[i].latitude;
    document.getElementById("latitude").innerHTML = jsonData2[i].latitude;
longitude=jsonData2[i].longitude;
    document.getElementById("longitude").innerHTML = jsonData2[i].longitude;
    document.getElementById("message").innerHTML = jsonData2[i].message;
    document.getElementById("speed").innerHTML = jsonData2[i].speed + " kmph";
    document.getElementById("address").innerHTML = jsonData2[i].address;
  }
}
initializeMap(parseFloat(latitude),parseFloat(longitude));
}
function handleClaim(action){
 var primary_keys = document.getElementById("veh_id").value;
  var channels = document.getElementById("channel").value;
  var truck_number = document.URL.split('vehicleNo=')[1];
  var azureClient1 = new WindowsAzure.MobileServiceClient('https://aiemobileservice.azure-mobile.net/', 'NYuUVUztAwEXJQZxOFbppximTExpoh26');
  var equipTable= azureClient1.getTable('smart_truck_incident');
// alert(channels);
var ids = primary_keys.split(',');
var channel_ids = channels.split(',');
$.each(ids, function( index, value ) {
doUpdates(equipTable,action,value,truck_number,channel_ids[index]);
});
if(action=="request"){
alert('Claim AAJ0100 has been successfully created. An email has been sent with the claim information. Please use this for your reference.')
}
if(action=="process"){
alert('Claim AAJ0100 has sent for further processing.')
}
if(action=="reject"){
alert('Claim AAJ0100 has been rejected. An email has been sent to LifeVac.')
}
if(action=="Cancel"){
alert('This incident has been cancelled and all records of the same have been removed.')
}
document.getElementById("request").disabled=true;
document.getElementById("cancel").disabled=true;
document.getElementById("process").disabled=true;
document.getElementById("reject").disabled=true;
}

function doUpdates(equipTable,action,primaryKey,trucknumber,channel_id)
{
if(action=="request"){
equipTable.update({                
id: parseInt(primaryKey),
truck_number:trucknumber,
activeIndicator: 1
});
 }
 if(action=="cancel"){
equipTable.update({                
id: parseInt(primaryKey),
activeIndicator: 3,
truck_number:trucknumber
 
});

 }
if(action=="process"){
equipTable.update({                
id: parseInt(primaryKey),
truck_number:trucknumber,
activeIndicator: 2
});
  }
  if(action=="reject"){
 equipTable.update({                
id: parseInt(primaryKey),
activeIndicator: 4,
truck_number:trucknumber
});
  }
}
