//database-setup.js will handle monoDB database creation/instance storage 
//so we will be able to access database across multiple files.
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/mailer';
let contacts; // will hold the contacts collection.
let db; //will hold database collection to bee used across files as well

//module.exports is used when creating JavaScript modules to export functions,objects, and other values to other programs.
module.exports = {

    //connect to database
    createDatabase: async() => {    
        console.log("Creating Database: ");    
        try {
            const connection = await MongoClient.connect(url);
            db = connection.db('webapps');
            contacts = await db.createCollection("contacts"); 
            console.log("Database Created Successfuly");
        } catch(err) {
            console.log(err)
        }
    },

    getDB: function() {
        return db;
    },

    getContactsCollection: function() {
        return contacts;
    },
}

