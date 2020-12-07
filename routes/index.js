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

router.post('/mailer.html', function(req,res,next) {    
    var body = req.body;
    console.log(body);
    mongoDatabase.getContactsCollection().insert(body);
    
    return;
});

router.get('/contacts', function(req, res, next) {
    testArr = mongoDatabase.getContactsCollection().find({id:"Mr"});
    testArr.toArray();

    mongoDatabase.getContactsCollection().find().toArray(function (err, result) {
        console.log(result);
        res.render("contacts", {responseList: result} );
    });    
});
    module.exports = router;

