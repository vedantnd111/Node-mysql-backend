const express = require('express');
const {
    requireLogIn,
    isAdmin
} = require('../controllers/auth');
const {
    readAll,
    read,
    create,
    update,
    roomById,
    removeById,
    photo
} = require('../controllers/rooms');
const {
    userById
} = require('../controllers/user');
const Router = express.Router();

Router.get('/rooms', readAll);

Router.get('/room/:roomId', read);

Router.post('/room/:userId', requireLogIn, isAdmin, create);

Router.put('/room/:roomId/:userId', requireLogIn, isAdmin, update);

Router.delete('/room/:roomId/:userId', requireLogIn, isAdmin, removeById);

Router.get('/photo/:roomId',photo);

Router.param('roomId', roomById);

Router.param('userId', userById);

module.exports = Router;