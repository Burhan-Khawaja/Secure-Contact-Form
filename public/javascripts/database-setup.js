//database-setup.js will handle monoDB database creation/instance storage 
//so we will be able to access database across multiple files.
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/mailer';
let contacts; // will hold the contacts collection.
let db;

module.exports = {

    //connect to database
    createDatabase: async() => {
        console.log("STARTING DATABASE");
        
        /*
        MongoClient.connect(url, function(err, database) {
            console.log("Connected correctly to server.");
            const myDatabase = database.db('dataBase');
            contacts = await myDatabase.collection("contacts");
            console.log("New Collection Made.");
        // console.log(contacts);
        });
        */
        try {
            const connection = await MongoClient.connect(url);
            db = connection.db('webapps');
            contacts = await db.createCollection("contacts"); 
            console.log("before error, this should run.");        
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

