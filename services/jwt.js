'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_spotify';

exports.createToken = function(user){
    var payload = {
        sub: user._id,//id de user en la bd
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //fecha de creacion del token
        exp: moment().add(30, 'min').unix //fecha de expiracion del token
    };

    return jwt.encode(payload, secret);
} 