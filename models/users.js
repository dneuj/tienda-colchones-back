var mongoose = require('mongoose');

//Esquema de usuarios
var UserSchema = new mongoose.Schema({
    _id: Number,
    email: String,
    pwd: String
});

mongoose.model('User', UserSchema);