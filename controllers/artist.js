'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//test
function artistTest(req, res){
    res.status(200).send({message: 'test artist works'});
}

//Crear artista
function saveArtist (req, res){
    var artist = new Artist();

    var params = req.body;

    if(params.name && params.description)
    {
        artist.name = params.name;
        artist.description = params.description;
        artist.image = 'null';

        //Controlar artistas duplicados
        Artist.find({ $or: [
                                {name: artist.name}
        ]}).exec((err, artists) => {

            if(err)
                res.status(500).send({message: 'Error en la peticion'});

            else if(artists && artists.length >= 1)
                res.status(200).send({message: 'El artista ya esta registrado'});
            
            else{
                artist.save((err, artistStored) => {
                    if(err)
                        res.status(500).send({message: 'Error en la peticion'});
                    else if(!artistStored)
                        res.status(404).send({message: 'No se ha registrado el artista'});
                    else    
                        res.status(200).send({artist: artistStored});        
                });
            }

        });
    }else{
        res.status(200).send({message: 'Debe llenar todos los campos'});
    }
}

module.exports = {
    artistTest,
    saveArtist
}