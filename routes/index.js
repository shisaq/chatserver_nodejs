module.exports = (io) => {
    var express = require('express');
    var router = express.Router();

    // socket.io API
    io.on('connection', (socket) => {
        console.log('Server connected successfully - ' +
            new Date().toLocaleString());

        socket.on('disconnect', () => {
            console.log('Client disconnected - ' +
                new Date().toLocaleString());
        });

        // a user presses enter after input a valid username
        socket.on('is_online', (name) => {
            io.sockets.emit('online_name', name);
        });

        // `inviter` selects `guest`, sending 2 usernames to server
        socket.on('build_private_room', (names) => {
            console.log('The inviter is: [' + names['inviter'] +
                '], the guest is: [' + names['guest'] + ']');
            var r = [names['inviter'], names['guest']];
            r.sort();
            var room = r.join('');

            io.sockets.emit('invite_match_user', {
                'inviter': names['inviter'],
                'guest': names['guest'],
                'room': room,
                'isActive': true
            });
        });

        // 2 filtered users emit this event, then join room
        socket.on('join_private_room', (data) => {
            socket.join(data['room']);
            console.log('Users: ' + data['inviter'] + ', ' +
                data['guest'] + ' joined the room [' +
                data['room'] + '].');
        });

        // send private messages
        socket.on('private_message', (data) => {
            io.to(data['room']).emit('room_message', data);
        });
    });

    return router;
};
