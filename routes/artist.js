'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/artistTest', artistController.artistTest);
api.post('/artist', md_auth.ensureAuth, artistController.saveArtist);
api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, artistController.updateArtist);

module.exports = api;