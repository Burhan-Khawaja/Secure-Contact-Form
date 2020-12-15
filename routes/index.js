var express = require('express');
const { Db } = require('mongodb');
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

//get contacts list
router.get('/contacts', function(req, res, next) {
    mongoDatabase.getContactsCollection().find().toArray(function (err, result) {
        console.log(result);
        res.render("contacts", {responseList: result} );
    });    
});

router.get('/update', function(req, res, next) {
    console.log("gETINNG UPDATE PAGE WAITAMINUTE");
    res.render("update", {});
});
    module.exports = router;

