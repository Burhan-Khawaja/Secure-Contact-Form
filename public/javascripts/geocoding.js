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
        id: 'mapbox/dark-v10',
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

//function that will post to server to recieve contact form with pre populated data.
//Will submit an invisible form to server.
function changeContact(contactID) {
    console.log("In change contact function. Welcome");
    console.log(contactID);
    //BURBUR legacy code. 
    //IF YOU DELETE THIS CODE DONT FORGET TO REMOVE 
    //AXIOS REQUIRE IN PUG FILE
    // axios.post("/TEST", contact)
    // .then(function (response) {
    //     console.log("Back in geocoding file, recieve axiosres");
    //     console.log(response);
    //     window.location = "/update";
    // });
    //console.log(contact._id)
    

    //Create a form with a hidden element that stores the contact
    //ID value which will be named _id
    //submit the form via  post request to /TEST
    let form = document.createElement('form');
    form.method = 'post';
    form.action = '/updateForm';
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = '_id';
    hiddenField.value = contactID;
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}

//function that creates a form to be submitted that will be responsbile for deleting a contact form the database.
//This function is called in contacts.pug as an event handler, and will post to /deleteContact in index.js which will delete the contact. 
function deleteContact(contactID) {
    console.log("In DELETE contact function. Welcome");
    console.log(contactID);
    let form = document.createElement('form');
    form.method = 'post';
    form.action = '/deleteContact';
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = '_id';
    hiddenField.value = contactID;
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
}


function searchTable() {   
    var input, filter, tbl, tr, td, i, txtValue;
    input = document.getElementById("searchBox");
    filter = input.value.toUpperCase();
    tbl = document.getElementById("contactList");
    tr = tbl.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
    //we have hidden longitude/latitude elements in each table row, so we get the 3rd td element which is the name
    td = tr[i].getElementsByTagName("td")[2];
    console.log(td);
    if (td) {
        txtValue = td.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
      }
    }
  }
}
