var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------
/*
  CCC 0/7: Create an API that exposes several CRUD operations over HTTP for a predefined data schema
*/
app.use(express.json());
require('./api')(app);

/*
  CCC 5/7: Allow CORS from any domain [as the 'cors' npm package does] -> Note: limited local testing w/ curl
*/
app.options('*', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, POST, GET, PUT, PATCH, DELETE',
        'Vary': 'Access-Control-Request-Headers',
    });
    res.status(204).send(); 
});
// -----------------------------------------------------

app.get('/', (req, res) => {
  res.render('index', { title: 'Candidate Code Challenge - NodeJS API' });
});

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

module.exports = app;
