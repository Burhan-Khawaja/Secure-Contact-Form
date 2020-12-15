//private mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmtoYXdhamEiLCJhIjoiY2tpMTJkM3VvMHZxcjJ5cGVsanA2aXg2OSJ9.lXT1twUQoyk9dJyp5ElbQw'
//first part of url string to make requests for geocoding
const MAPBOX_REQUEST_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
//need database access to readd markers on map
//let mongoDatabase = require('./database-setup');
let myMap;

const addLocation = async () => {
    console.log("Adding location.");
    //access html form to later append address
    let form = document.getElementById("myForm");
    //access address elements.
    let street = document.getElementById("street");
    let city   = document.getElementById("city");
    let state  = document.getElementById("state");
    let zip    = document.getElementById("zip")
    
    let address = street.value + " " + city.value + ", " + state.value + " " + zip.value;
    const normalized = encodeURIComponent(address);
    const tmpUrl = MAPBOX_REQUEST_URL + normalized + '.json?access_token=' +  MAPBOX_TOKEN;

    let responseLocationArray;
    //issue AJAX axios request to mapbox server to retireve location of address in longitide/latitude. 
    //store long/lat array into responseLocationArray.
    const mapbox_response = await axios.get(tmpUrl)
        .then(function (response) {
            //on response, store the array of longitude/latitude in variable for easier access.
            responseLocationArray = response.data.features[0].center;           
        })
        .catch(function(error) {
            console.log(error);
        });

    //create variable for longitude, store value from responseLocationArray
    //to longitude in string form as a text node, and set longitude in form to value???
    var formLongitude = document.getElementById("long");
    formLongitude.value = responseLocationArray[0];
        
    //same algorithm as above for latitude
    var formLatitude = document.getElementById("lat");
    formLatitude.value = responseLocationArray[1];

    form.submit();
}


/*
//
//  NAME
//  createMap () -  Create the map to display on html page using leaflet. createMap will be called in app.js file beacuse we need to create the map
//                  before the user enters in addresses, and not when the user requests the contacts page.
//                  This is so when the user requests the contacts page, if a new map is created then we will lose access to the markers from before.
//
*/
const createMap = async(long,lat) => {
    myMap = await L.map('myMap').setView([41, -74], 10);

    await L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYmtoYXdhamEiLCJhIjoiY2tpMTJkM3VvMHZxcjJ5cGVsanA2aXg2OSJ9.lXT1twUQoyk9dJyp5ElbQw'
    }).addTo(myMap);
}
    
/*
//
//  NAME
//  addMarker (long,lat) -  Add markers to map. This function is called in contacts.pug file. 
//                          funciton is supplied longitiude and latitude elements to create marker.
//                  
//  PARAMS-                 
//          long - longitude, retrieved from mongoDB database
//          lat - latitude, also supplied from databaswe
*/  
const addMarker = async(long,lat) => {
    await L.marker( [lat,long] ).addTo(myMap);
}


function changeContact(contact) {
    console.log("In change contact function. Welcome");
    console.log(contact);
    //console.log(contact._id)
}

