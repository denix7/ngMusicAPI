'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_spotify';

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no tiene cabecera authorization'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');//comillas simples y dobles sustituir por nada

    try{
        //decodifica segun el token y clave secreta
        var payload = jwt.decode(token, secret);
        
        if(payload.exp <= moment().unix()){
            //si la fecha de expiracion del payload es menor al momento actual, expiro
            return res.status(401).send({message: 'El token ha expirado'});
        }
    }catch(ex){
        //console.log(ex);
        return res.status(404).send({message: 'Token no valido'});
    }

    req.user = payload; //agrega al req los datos del usuario en el payload

    next(); //sale del middleware
}