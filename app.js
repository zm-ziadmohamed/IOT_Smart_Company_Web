var createError = require('http-errors');
var express = require('express');
var path = require('path');
const hbs = require('hbs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
const authRouter = require('./routes/Auth');
const employeesRouter = require('./routes/employees')
const employeeAttendanceRouter = require('./routes/employeeAttendance');
const lightControlRouter = require('./routes/lightControl');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Register partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

require('dotenv').config();
// Connecting to the database
mongoose.connect(process.env.DB_USERNAME, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB...")})
  .catch(err => console.log(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Session and flash setup
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to `true` if using HTTPS
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/',employeesRouter)
app.use('/',employeeAttendanceRouter)
app.use('/',lightControlRouter)

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
