var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoDatabase = require('./public/javascripts/database-setup');
var indexRouter = require('./routes/index');

var app = express();

const test = 10000000;
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
/*
const createDatabase = async() => {
    console.log("STARTING DATABASE");
    /*
    MongoClient.connect(url, function(err, database) {
        console.log("Connected correctly to server.");
        const myDatabase = database.db('dataBase');
        contacts = await myDatabase.collection("contacts");
        console.log("New Collection Made.");
    // console.log(contacts);
    });
    
    try {
        const connection = await MongoClient.connect(url);
        const db = connection.db('webapps');
        contacts = await db.createCollection("contacts"); 
        console.log("before error, this should run.");        

    } catch(err) {
        console.log(err)
    }
}
*/
//create database.
mongoDatabase.createDatabase();
module.exports = app;
