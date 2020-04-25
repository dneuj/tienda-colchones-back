var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

//Esquema de usuarios
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      hash: String,
      salt: String
});

//Setear la contraseña
UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

//Validar contraseña
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, secret);
  };

mongoose.model('User', UserSchema);