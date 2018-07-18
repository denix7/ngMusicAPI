'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

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

//Obtener un artista
function getArtist (req, res){
    
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err)
            res.status(500).send({message: 'Error en la peticion'});
        else if(!artist)
            res.status(404).send({message: 'No existe ese artista'});
        else    
            res.status(200).send({artist});        
    });
}

//Obtener artistas paginados
function getArtists (req, res) {

    var page = 1;
    if(req.params.page)
        page = req.params.page;
    
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if(err)
            res.status(500).send('Error en la peticion');
        else if(!artists)
            res.status(404).send({message: 'No existen artistas registrados'});
        else    
            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                artists: artists
            });        
    });

}

//Editar artista
function updateArtist (req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err)
            res.status(500).send('Error en la peticion');
        else if(!artistUpdated)
            res.status(404).send({message: 'No existen artistas registrados'});
        else    
            return res.status(200).send({artist: artistUpdated});        
    });
}

module.exports = {
    artistTest,
    saveArtist,
    getArtist,
    getArtists,
    updateArtist
}