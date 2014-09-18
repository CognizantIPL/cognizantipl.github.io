/*
 
 * @author: Subramanian,Meyyappan(273857)
 * 
 * Detail: Connecting with foresight and get deviceList & device data
 * 
 * Version: Initial Version 1-Aug-2013
 * 			-- Version 0.7 24-Sep-2013
 * 
 * Â© 2013 Cognizant, All rights reserved.
 *          
 *  */
function initialize(e,t){if(typeof e=="object"&&typeof t=="function"){if(e.key)appKey=e.key;else{t("App-Key is required",null);return}if(e.secret)appSecret=e.secret;else{t("App-secret is required",null);return}if(e.apiHost)apiService=e.apiHost;else{t("API-host is required",null);return}if(e.aToken&&e.aToken!="null")validateAccessToken(e.aToken,function(e,n){t(e,n)});else if(e.aToken==="null")t(null,true);else{t("Access-Token is required",null);return}}else console.log("Options must be an object")}function validateAccessToken(e,t){accessToken=e;try{$.ajax({url:protocol+apiService+apiBaseurl+"/oauth/profile?access_token="+e,type:"GET",crossDomain:true,async:false,timeout:15e3,headers:{app_key:appKey,app_secret:appSecret},success:function(e){var n=typeof e==="string"?JSON.parse(e):e;n=Object.keys(n.attributes.allowed);$.each(n,function(e,t){var e=t.split("-")[1];getStreamInfo(e);arrayObj.push(e)});t(null,arrayObj)},error:function(e){t(e,null)}})}catch(n){console.log(n)}}function getDevices(e,t,n){if(typeof e!="function"){if(typeof e=="string"){e=[e]}sLength=e.length;setTimeout(function(){$.each(e,function(e,r){getDeviceList(r,{check:false},function(e){if(sLength===dList.length){if(t.type==="id"){n(dList)}else if(t.type==="info"){$.each(dList,function(e,t){if(t["static"]){deviceInfo(t.devices,function(e){var r={"static":t["static"],devices:e};n([r])})}else{getData(t.devices,{check:true},function(e){var r={"static":t["static"],devices:e};n([r])})}})}else n("options must not be an empty object")}})})},500)}else{t("options field needed")}}function getStreamInfo(e,t){if(typeof t=="undefined")t=null;try{$.ajax({url:protocol+apiService+apiBaseurl+"/streams/"+e,type:"GET",async:false,crossDomain:true,headers:{app_key:appKey,app_secret:appSecret},success:function(e){e=typeof e==="string"?JSON.parse(e):e;streamInfo[e.id]=e;if(t)t(e)},error:function(e){t(e)}})}catch(n){console.log(n)}}function deviceInfo(e,t){try{$.ajax({url:protocol+apiService+apiBaseurl+"/devices/"+e+"?fields=id,name,location",type:"GET",crossDomain:true,headers:{app_key:appKey,app_secret:appSecret},success:function(e){e=typeof e==="string"?JSON.parse(e):e;if(e.data)t(e);else{var n={};if(e.id)n["data"]=[e];else n["error"]=[e];t(n)}},error:function(e){t(e)}})}catch(n){console.log(n)}}function watchNewDevices(e,t,n){if(!t.interval)t.interval=10;if(typeof e=="string"){e=[e]}sLength=e.length;try{for(index in e)watchDevices(e[index],t.interval,n)}catch(r){console.log(r)}}function watchDevices(e,t,n){timeIntervals[e]=setInterval(function(){getDeviceList(e,{check:true},n)},t*1e3)}function getDeviceList(e,t,n){try{$.ajax({url:protocol+apiService+apiBaseurl+"/streams/"+e+"/devices",type:"GET",crossDomain:true,headers:{app_key:appKey,app_secret:appSecret},success:function(r){if(typeof r==="string")r=JSON.parse(r);if(!t.check){dList.push(r);watchList[e]=r;n(r)}else{var i=[];$.each(r.devices,function(t,n){if($.inArray(n,watchList[e].devices)==-1){i.push(n);watchList[e].devices.push(n)}});if(i.length>0){$.each(i,function(e,t){deviceInfo(t,n)})}}},error:function(e){n(e)}})}catch(r){console.log(r)}}function stopWatch(e){clearInterval(timeIntervals[e]);sLength-=1}function stopTracking(e){for(index in trackIntervals[e]){clearInterval(trackIntervals[e][index])}}function watchData(e,t){setTimeout(function(){if(!e.interval||e.interval<5){e.interval=10}if(e.trackBy==="stream"&&e.id&&typeof e.id==="string"){var n=e.id.split(",");$.each(n,function(n,r){if(watchList[r]){e.id=r;track(watchList[r].devices,e,t)}else if($.inArray(r,arrayObj)!=-1){e.id=r;watchData(e,t)}else t({id:r,error:"Requested stream not allowed"})})}else if(e.trackBy==="devices"&&e.id&&typeof e.id==="string"){var r=e.id.split(",");$.each(r,function(n,r){e.id=r;track(r,e,t)})}else t({error:"Options needed correct information.(eg: {trackBy: stream/devices, id: 1,2,3,.., interval: optional, alert:optional })"})},500)}function track(e,t,n){t.check=true;if(!trackIntervals.hasOwnProperty(t.id)){trackIntervals[t["id"]]=[setInterval(function(){getData(e,t,n)},t.interval*1e3)]}else{trackIntervals[t["id"]].push(setInterval(function(){getData(e,t,n)},t.interval*1e3))}}function getData(e,t,n){try{var r=0;var i=10;var s=e;var o=null;o=setInterval(function(){var u=s.slice(r,i);if(e.slice(r,i).length>0){$.ajax({url:protocol+apiService+apiBaseurl+"/devices/"+u+"/data",type:"GET",crossDomain:true,headers:{app_key:appKey,app_secret:appSecret},success:function(e){if(typeof e==="string")e=JSON.parse(e);if(!t.check)n(e);else processLastData(e,t,n)},error:function(e){n(e)}});r=i;i+=10}else{n({status:"completed"});clearInterval(o)}},1e3)}catch(u){console.log(u)}}function processLastData(e,t,n){if(e["error"])n({error:e.error});$.each(e.data,function(e,r){var i=r.id.split("::")[2];var s=streamInfo[i].freq;var o=r.timestamp;var u=parseInt((new Date).getTime()/1e3);var a=u-o;if(t.alert&&t.alert==="offline"){if(a<=s){if(eventList[r["id"]]){eventList[r["id"]]=false;n({online:r.id,lastData:r})}}else{if(!eventList[r["id"]]){n({offline:r.id,msg:"No data was sending by the device "+r.id,lastData:r})}eventList[r["id"]]=true}}else{if(a<=s)n({data:r});else n({offline:r.id,msg:"No data was sending by the device "+r.id,lastData:r})}})}function streaming(e,t){arrayid=e["id"].split(",");$.each(arrayid,function(n,r){var i=r.split("::");var s=i[1];var o=i[2];var u="";if(accessToken)u=protocol+apiService+apiBaseurl+"/gateways/"+s+"/streams/"+o+"/streaming?access_token="+accessToken+"&deviceid="+i[3];else u=protocol+apiService+apiBaseurl+"/gateways/"+s+"/streams/"+o+"/streaming?deviceid="+i[3];var a=0;try{if(!streamingId[r]){var f=new XMLHttpRequest;f.open("GET",u,true);f.setRequestHeader("Content-type","application/json");f.setRequestHeader("app_key",appKey);f.setRequestHeader("app_secret",appSecret);streamingId[r]=f;streamingTimeout(r,e.reconnect,t);f.onreadystatechange=function(){if(f.status==200){if(f.readyState>=3){if(streamingTimedOut[r])clearTimeout(streamingTimedOut[r]);if(f.readyState!=4){var n=f.responseText;n=n.substr(a,n.length-a);a=f.responseText.length;try{n=JSON.parse(n);t(null,n)}catch(i){console.log(i)}}else{delete streamingId[r];var s={id:r};if(e.reconnect){s.reconnect=true;streaming(s,t)}else t({id:r,msg:"Request timed out. No response from server try again later."},null)}}}};f.send(null)}else t({id:r,msg:"Request already inprogress. Please wait..."},null)}catch(l){console.log(l)}})}function streamingTimeout(e,t,n){streamingTimedOut[e]=setTimeout(function(){if(streamingId[e]){streamingId[e].abort();delete streamingId[e];if(t)streaming({id:e,reconnect:true},n);else n({id:e,msg:"Request timed out. No response from server try again later."},null)}else clearTimeout(streamingTimedOut[e])},3e4)}function stopStreaming(e){if(streamingTimedOut[e])clearTimeout(streamingTimedOut[e]);if(streamingId[e]){streamingId[e].abort();delete streamingId[e]}}function historyData(e,t){try{var n=e.sid.split(",");$.each(n,function(n,r){var i={from:e.from,to:e.to,columns:e.columns,constraint:e.constraint,limit:e.limit||500};$.ajax({url:protocol+apiService+apiBaseurl+"/streams/"+r+"/hsdata?access_token="+accessToken,type:"POST",data:i,crossDomain:true,headers:{app_key:appKey,app_secret:appSecret},success:function(e){if(typeof e==="string")e=JSON.parse(e);t(e)},error:function(e){t(e)}})})}catch(r){console.log(r)}}function socketStreaming(e,t){var n=io.connect(e);n.on("payload",function(e){n.emit("received","Data received");t(e)})}function getColumns(e,t){try{var n=e.length;var r=[];$.each(e,function(e,i){$.ajax({url:protocol+apiService+apiBaseurl+"/categories/"+i+"?fields=schema,name",type:"GET",crossDomain:true,async:false,headers:{app_key:appKey,app_secret:appSecret},success:function(e){if(typeof e==="string")e=JSON.parse(e);r.push({id:i,columns:Object.keys(e.schema.params.properties),name:e.name});if(n==r.length)t(r)},error:function(e){r.push({id:i,error:e.statusText});if(n==r.length)t(r)}})})}catch(i){console.log(i)}}var appKey=appSecret=apiService=accessToken=null;var apiBaseurl="/api/v1";var protocol="http://";var timeIntervals={};var trackIntervals={};var dList=[];var watchList={};var streamInfo={};var streamingTimedOut={};var streamingId={};var deviceProfile=[];var sLength=0;var eventList=[];var arrayObj=[];
