module.exports = function(io) {
    var express = require('express');
    var router = express.Router();

    io.on('connection', function(socket) {
        console.log('hi');
    });

    return router;
};
