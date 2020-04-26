var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Devuelve si el usuario no fue encontrado en bd
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Devuelve si la contraseña es incorrecta
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // Devuelve el usuario si las credenciales son correctas
      return done(null, user);
    });
  }
));