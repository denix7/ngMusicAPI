'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Cargar rutas
var user_routes = require('./routes/user');



//Cargar middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Cargar CORS y Cabeceras 




//Rutas 
app.get('/test', (req, res) => {
    res.status(200).send({message: "Server its Works!"});
});

//ruta base
app.use('/api', user_routes);

module.exports = app;