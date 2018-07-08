'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/userTest', md_auth.ensureAuth, userController.userTest);
api.post('/register', md_auth.ensureAuth, userController.saveUser);
api.post('/login', userController.loginUser);

module.exports = api;
