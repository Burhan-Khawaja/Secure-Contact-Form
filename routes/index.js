var express = require('express');
const { Db, ObjectId } = require('mongodb');
const { getContactsCollection } = require('../public/javascripts/database-setup');
var router = express.Router();
let mongoDatabase = require('../public/javascripts/database-setup');
/* GET start page. 
   I'm allowing the user to hit multiple URLs and 
   still get the same functionality.  I could also
   use regular expressions here, instead of explicitely
   listing multiple url paths.  Choice is yours.
*/

/* GET home page. */
router.get('/mailer', function(req, res, next) {
    res.render('mailer', { });
});

//retrieve mailer page that contains form
router.post('/mailer.html', function(req,res,next) {  
    console.log("Posting Data");  
    var body = req.body;
    //BURBUR should process data to be better.
    console.log(body);
    mongoDatabase.getContactsCollection().insertOne(body);
    console.log("Completed Submittion of Data to Database");
    res.render("submission", {});
});

//get and display contacts list
router.get('/contacts', function(req, res, next) {
    mongoDatabase.getContactsCollection().find().toArray(function (err, result) {
        res.render("contacts", {responseList: result} );
    });    
});

//HTTP request that will UPDATE DATABASE BASED on CHANGES USER MADE TO CONTACT
router.post('/updateDatabase', function(req, res, next) {
    console.log("GETINNG UPDATE PAGE WAITAMINUTE");
    //we want to update the database, but we get an error if we try and update with ID still as a param in the object,
    //Solution : Store in a temp variable, and delete it from the array.
    let tmp = req.body._id;
    delete req.body._id;
    //change mongodb object, and then display contacts page after.
    mongoDatabase.getContactsCollection().updateOne( {_id: ObjectId(tmp.toString())}, {'$set' : req.body} );
    
    mongoDatabase.getContactsCollection().find().toArray(function (err, result) {
        if(err) {
            console.log(err);
        }
        //redirect user to contacts page once data has been changed.
        res.redirect('/contacts');
    }); 
});

//http request that will FIND OBJECT BY MONGO ID and DISPLAY FORM WITH PRE POPULATED INFO
router.post('/updateForm', function(req, res, next) {
    //find correct mongoDB c ontact to change by using the id that was passed in,
    //we must turn it into a string first, then an objectID from mongo's library. 
     mongoDatabase.getContactsCollection().find( {_id: ObjectId(req.body._id.toString())} ).toArray(function (err, result) {
         if(err) {
             console.log(err);
         }
         res.render('update', {contact: result});
     });
});

router.post('/deleteContact', function(req,res,next) {
    mongoDatabase.getContactsCollection().findOneAndDelete( {_id: ObjectId(req.body._id.toString())}, function (err,result) {
        if(err) {
            console.log(err);
        }
        res.redirect('/contacts');
    });
});


router.post('/updateSubmission', function(req,res,next ) {
    console.log("POSTING IN updateSubmission")
});

module.exports = router;

