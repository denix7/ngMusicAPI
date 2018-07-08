'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

api.get('/userTest', userController.userTest);
api.post('/register', userController.saveUser);

module.exports = api;
