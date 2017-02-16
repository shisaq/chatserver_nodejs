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
            socket.emit('online_name', name, broadcast=true);
        });

        // `inviter` selects `guest`, sending 2 usernames to server
        socket.on('build_private_room', (names) => {
            console.log('The inviter is: [' + names['inviter'] +
                '], the guest is: [' + names['guest'] + ']');
            var r = [names['inviter'], names['guest']];
            r.sort();
            var room = r.join('');
            console.log(room);

            socket.emit('invite_match_user', {
                'inviter': names['inviter'],
                'guest': names['guest'],
                'room': room,
                'isActive': true
            }, broadcast=true);
        });

        // 2 filtered users emit this event, then join room
        socket.on('join_private_room', (data) => {
            join_room(data['room']);
            console.log('Users: ' + data['inviter'] + ', ' +
                data['guest'] + ' joined the room [' +
                data['room'] + '].');
        });

        // send private messages
        socket.on('private_message', (data) => {
            socket.emit('room_message', data, room=data['room']);
        });
    });

    return router;
};
