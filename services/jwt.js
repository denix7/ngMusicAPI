'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_spotify';

exports.createToken = function(user){
    var payload = {
        sub: user._id,//id de la bd
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'min').unix
    };

    return jwt.encode(payload, secret);
} 