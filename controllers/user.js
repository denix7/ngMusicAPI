'use strict'

var user = require('../models/user')

function userTest(req, res){
    res.status(200).send({message: 'test users works'});
}

module.exports = {
    userTest
}
