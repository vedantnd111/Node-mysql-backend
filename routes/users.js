const express = require('express');
const Router = express.Router();
const {
    signup,
    login,
    logout
} = require('../controllers/users');
const {signUpValidator}=require('../validators/index');

Router.post('/register',signUpValidator, signup);

Router.post('/login', login);

Router.get('/logout', logout);

module.exports = Router;