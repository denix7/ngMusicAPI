'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/artistTest', artistController.artistTest);


module.exports = api;