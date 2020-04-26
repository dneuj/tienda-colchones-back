var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');

const { user, pwd, ip, db, origin, c_prods, c_users, c_name, c_pwd, c_email } = require('./config/config');


mongoose.connect(`mongodb://${user}:${pwd}@${ip}/${db}`,
{useUnifiedTopology: true,useNewUrlParser: true}, 
function(err) {
  if(err){
    console.log("Connection error with: " + err);
  }
});

//importamos los models de producto y users
require('./models/products');
require('./models/users');
require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Validar la existencia de la colección usuarios
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server.');
  //obtiene lista de colecciones
  mongoose.connection.db.listCollections({ name: c_users }).toArray(function (err, names) {
    //Si no encontramos la coleccion de usuarios creamos un usuario
    if(names==[]){
        var auth = require('./controllers/authentication');
        var newuser = {name: c_name, email: c_email,
          password: c_pwd}
        
        auth.register(newuser);
      }
  });
});

var app = express();

// Add headers
app.use(function (req, res, next) {
  
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', origin);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(passport.initialize());
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
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
