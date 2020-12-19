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
*///burbur
//router.get('/', mailer);

// router.use((req,res,next) => {
//     if (req == "/mailer") {
//         res.render('mailer', { });
//     }
//    if(req.user) {
//         console.log("going to next");
//         next();
//     }
//    else {
//        console.log("Redirecting to login page.")
//        res.render("\login");
//     }  
// });


/* GET home page. */
router.get('/mailer', function(req, res, next) {
    res.render('mailer', { });
});

//retrieve mailer page that contains form
router.post('/submit', function(req,res,next) {  
    console.log("Posting Data");  
    var body = req.body;
    //BURBUR should process data to be better.
    console.log(body);
    console.log("==============Chaning contact========");
    contactCleaner(body);
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


/*
    contactCleaner - Responsible for taking the information submitted from the form and putting the data together and adding it to the global list
                    (ie- appending the data for address/name to one string and checking how to contact a person.)
    
    parameters
        contactInfo - Object that stores processed post request.
 */
function contactCleaner(contactInfo) {
    //check if object has all properties required.
    //combine the different form elements to make 1 name string and 1 address string that contain all the information.


    //check that the object contains the phoneContact proprty and that it is on
    //set the contactByPhone to true
    if("phoneContact" in contactInfo && contactInfo.phoneContact == "on") {
        contactInfo.contactByPhone = true;
    }
    else {
        contactInfo.contactByPhone = false;
    }
    
    //check that the mailContact is in the object, and that it is enabled.
    if("mailContact" in contactInfo && contactInfo.mailContact == "on") {
        contactInfo.contactByMail = true;
    }
    else {
        contactInfo.contactByMail = false;
    }
    
    //check for emailContact in the object, and make sure that it is enabled.
    if("emailContact" in contactInfo && contactInfo.emailContact == "on") {
        contactInfo.contactByEmail = contactInfo.email;
    }
    else {
        contactInfo.contactByEmail = "No";
    }

    //check if the user selected the "any" option, and if they have then set all the contact options to the values they gave.
    if("anyContact" in contactInfo && contactInfo.anyContact == "on") {
        contactInfo.contactByPhone = true;
        contactInfo.contactByMail = true;
        contactInfo.contactByEmail = contactInfo.email;
    }
}


module.exports = router;

