const express = require('express');
const Router = express.Router();

const {
    requireLogIn,
    isAdmin,
    isAuth
} = require("../controllers/auth");
const {
    userById,
    read,
    update,
    readAll
} = require('../controllers/user');

Router.get('/user/:userId', requireLogIn, isAuth, read);

Router.put('/user/:userId', requireLogIn, isAuth, update);

Router.get('/users/:userId', requireLogIn, isAdmin, readAll);

Router.param('userId', userById);

module.exports = Router;