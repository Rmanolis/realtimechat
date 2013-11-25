/*
 * GET home page.
 */
module.exports = function (models, io) {
    var u = require('underscore');
    var mongoose = require('../settings').mongoose;
    var index = function (req, res) {
        res.render('chat', { title: 'Chat' });
    };


    var sendMessage = function (req, res) {
        var msg = req.body.message.replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

        var message = models.Message.sendMessage(msg, req.session.nickname, req.body.isDedicated);


        io.sockets.emit('message', message);
        if (message.isDedicated) {
            var dedication = models.Dedication.addDedication(message.message, message.nickname);
            io.sockets.emit('dedication', dedication)
        }

        res.status(200);
        res.send();
    };

    var getLatestMessages = function (req, res) {
        models.Message.model.find({}).sort({'date': -1}).limit(10).exec(function (err, posts) {
            if (err) {
                res.json([]);
                console.log('could nt get latest messages');
            } else {
                res.json(posts);
            }
        });
    };

    var getLatestDedications = function (req, res) {
        models.Dedication.model.find({}).sort({'date': -1}).limit(10).exec(function (err, posts) {
            if (err) {
                res.json([]);
                console.log('could nt get latest dedications');
            } else {
                res.json(posts);
            }
        });
    };


    var isUser = function (req, res) {

        models.User.model.findOne({ip: req.ip}, function (err, user) {
            if (err) {
                res.json({is: false});
            } else {
                if (user) {
                    req.session.nickname = user.nickname;
                    req.session.save();
                    res.json({is: true, nickname: req.session.nickname});
                } else {
                    res.json({is: false});

                }
            }
        });

    };

    var addUser = function (req, res) {
        console.log('Adding user ' + req.body.nickname)
        req.session.nickname = req.body.nickname;

        models.User.addUser(req.session.nickname, req.ip,function(user){
           io.sockets.emit('user',user);
           res.json({saved: true,ip:req.ip});

        });
        res.status(200);

    };


    return{
        index: index,
        sendMessage: sendMessage,
        addUser: addUser,
        isUser: isUser,
        getLatestMessages: getLatestMessages,
        getLatestDedications: getLatestDedications
    }
};