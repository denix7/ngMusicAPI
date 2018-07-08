'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.get('/userTest', userController.userTest)

module.exports = api;
