'use strict'

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

//test
function artistTest(req, res){
    res.status(200).send({message: 'test artist works'});
}

module.exports = {
    artistTest
}