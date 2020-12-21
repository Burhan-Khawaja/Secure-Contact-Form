//geocoding.JS will handle the geocoding aspect of the project as well as the map creation, marker addition, and deleting and updating contacts
//this is client side javascript

//private mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmtoYXdhamEiLCJhIjoiY2tpMTJkM3VvMHZxcjJ5cGVsanA2aXg2OSJ9.lXT1twUQoyk9dJyp5ElbQw'
//first part of url string to make requests for geocoding
const MAPBOX_REQUEST_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
//need database access to readd markers on map
//let mongoDatabase = require('./database-setup');
let myMap;


/*
//  NAME
//  addLocation () - Adds the longitude/latitude location of the users address to the form before submitting it.        
*/
const addLocation = async () => {

    //access html form to later append address
    let form = document.getElementById("myForm");
    //access address elements.
    let street = document.getElementById("street");
    let city   = document.getElementById("city");
    let state  = document.getElementById("state");
    let zip    = document.getElementById("zip")
    
    var address = street.value + " " + city.value + ", " + state.value + " " + zip.value;
    //create url with no spaces, then append base request url, normalized address, and token to form a url.
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

    //get 2 form elements long and lat in document and set them according to what mapbox sent back    
    let formLongitude = document.getElementById("long");
    formLongitude.value = responseLocationArray[0];
        
    //same algorithm as above for latitude
    let formLatitude = document.getElementById("lat");
    formLatitude.value = responseLocationArray[1];

    form.submit();
}


/*
//
//  NAME
//  createMap () -  Create the map to display on html page using leaflet. 
//
*/
const createMap = async() => {
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
//  addMarker (long,lat) -  Add markers to map. Also creates event handler to display contact tooltip on hover.
//                           called in contacts.pug file. 
//                                            
//  PARAMS-                 
//          long - longitude, retrieved from mongoDB database
//          lat - latitude, also supplied from databaswe
*/  
const addMarker = async(response) => {
    let marker = await L.marker( [response.latitude,response.longitude] );
    //create some html that will be shown when hovered over the marker.

    //create paragraph elements for name, address, phone, email, and text elements for the text.
    //append the text to the paragraph elements, then append the paragraph elements to a div.
    let name = document.createElement('p');
    let nameText = document.createTextNode(response.first + " " + response.last);
    name.append(nameText);

    let address = document.createElement('p');
    let addressText = document.createTextNode(response.street +" " + response.city + ", " + response.state + " " + response.zip);
    address.append(addressText);

    let phone = document.createElement('p');
    let phoneText = document.createTextNode(response.phone)
    phone.append(phoneText);
    
    let email = document.createElement('p');
    let emailText = document.createTextNode(response.email);
    email.append(emailText);

    //create div and append paragraphs to it
    let popupContent = document.createElement('div');
    popupContent.append(name);
    popupContent.append(address)
    popupContent.append(phone)
    popupContent.append(email)
    popupContent.className = 'mapMarkerTooltip'

    marker.bindPopup(popupContent).openPopup();

    marker.on('mouseover',function(ev) {
        marker.openPopup();
    });
    marker.addTo(myMap)
}


/*
//
//  NAME
//      changeContact (contactID) - called when user wants to update contact.
//                                  Create invisible form to post to server with the _id of the contact to be updated
//                                            
//  PARAMS-                 
//          contactID - mongoDB _id object so the server can look up the contact and pre populate the form.
*/  
function changeContact(contactID) {
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


/*
//
//  NAME
//      changeContact (contactID) - creates a form to be submitted that will be responsbile for deleting a contact from the database.
//                                  called in contacts.pug as an event handler, and will post to /deleteContact in index.js. 
//                                            
//  PARAMS-                 
//          contactID - mongoDB _id object so the server can look up the contact and delete it..
*/  
function deleteContact(contactID) {
    //Create a form with a hidden element that stores the contact
    //ID value which will be named _id
    //submit the form via  post request to /TEST
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

/*
//
//  NAME
//      searchTable () - search "name" column of the table when the user presses a key in the search bar. 
//                                            
*/ 
function searchTable() {   
    let input = document.getElementById("searchBox");
    let filter = input.value.toUpperCase();
    let tbl = document.getElementById("contactList");
    let tr = tbl.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tr.length; i++) {
    //we have hidden longitude/latitude elements in each table row, so we get the 3rd td element to access the name
    let td = tr[i].getElementsByTagName("td")[2];
    if (td) {
        let txtValue = td.textContent;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        }
        else {
            tr[i].style.display = "none";
      }
    }
  }
}
