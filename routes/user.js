'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/userTest', md_auth.ensureAuth, userController.userTest);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/user-update/:id', md_auth.ensureAuth, userController.updateUser);

module.exports = api;
