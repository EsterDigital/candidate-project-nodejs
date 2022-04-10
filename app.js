var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// added extra packages
var cors = require('cors')
var rateLimit = require('express-rate-limit');
var helmet = require('helmet');
var xss = require('xss-clean');
var hpp = require('hpp');

// routes
var userRoutes = require('./routes/user');
var postRoutes = require('./routes/post');
var commentRoutes = require('./routes/comment');

var app = express();

// Enable cors
app.use(cors());
// Secure HTTP headers using helmet
app.use(helmet());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(hpp());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'Candidate Code Challenge - NodeJS API' });
});

// limiter for repeated requests to api routes
var limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // allows 100 requests in 60 mins
  message: 'Too many requests, try again later!',
});
app.use('/api', limiter);

// api routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);

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
