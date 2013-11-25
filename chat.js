/**
 * Created by manos on 11/19/13.
 */

module.exports = function (app,models) {

    app.io.sockets.on('connection', function (socket) {
        socket.on('registerID', function (data) {
            console.log('received ' + data.ip)
            models.User.addID(data.ip,socket.id);

        });
    });


}