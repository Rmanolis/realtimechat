/**
 * Created by manos on 11/23/13.
 */

module.exports = function(models,io){

    var u = require('underscore');
    var mongoose = require('../settings').mongoose;

    var index = function (req, res) {
        res.render('administrator', { title: 'Administration' });
    };

    var getAllMessages = function(req,res){
        models.Message.model.find({}).sort({'date':-1}).exec(function(err,posts){
            if(err){
                res.json([]);
                console.log('could nt get all messages');
            }else{
                res.json(posts);
            }
        });
    };

    var getAllDedications = function(req,res){
        models.Dedication.model.find({}).sort({'date':-1}).exec(function(err,posts){
            if(err){
                res.json([]);
                console.log('could nt get all dedications');
            }else{
                res.json(posts);
            }
        });
    };

    var getAllUsers = function(req,res){
        models.User.model.find({}).sort({'date':1}).exec(function(err,posts){
            if(err){
                res.json([]);
                console.log('could nt get all users');
            }else{
                res.json(posts);
            }
        });
    };

    var removeMessage = function(req,res){

        models.Message.removeMessage(req.body.id);
        io.sockets.emit('removeMessage',{ id : req.body.id});
        res.send();
    };

    var removeDedication = function(req,res){
        models.Dedication.removeDedication(req.body.id);
        io.sockets.emit('removeDedication',{ id : req.body.id});

        res.send();
    };

    var removeUser = function(req,res){
        var userIP = req.body.ip;
        models.User.removeUser(userIP);
        models.User.model.findOne({ip:userIP},function(err,data){
           if(!err && data){
               io.sockets.socket(data.socketID).emit('registerAgain');
           }
        });
        res.send();
    };

    var blockUser= function(req,res){
      models.User.blockIP(req.ip);
      res.send()
    };

    var unblockUser= function(req,res){
        models.User.unblockIP(req.ip);
        res.send()
    };


    var acceptDedication = function(req,res){
        models.Dedication.acceptDedication(req.body.id,function(dedication){
            io.sockets.emit('acceptedDedication',dedication);
        });


        res.send();
    };

    var removeAllMessages = function(req,res){
        models.Message.removeAllMessages();
        io.sockets.emit('allMessagesRemoved', {removed:true});
        res.send();
    }

    var removeAllDedications = function(req,res){
        models.Dedication.removeAllDedications();
        io.sockets.emit('allDedicationsRemoved', {removed:true});
        res.send();
    }
    var removeAllUsers = function(req,res){
        models.User.removeAllUsers();
        io.sockets.emit('allUsersRemoved', {removed:true});
        delete req.session.nickname;

        res.send();
    }

    return{
        index : index,
        getAllMessages : getAllMessages,
        getAllDedications : getAllDedications,
        getAllUsers : getAllUsers,
        removeUser : removeUser,
        blockUser : blockUser,
        unblockUser : unblockUser,
        removeMessage : removeMessage,
        removeAllMessages : removeAllMessages,
        removeAllDedications : removeAllDedications,
        removeAllUsers : removeAllUsers,
        removeDedication : removeDedication,
        acceptDedication : acceptDedication
    }

};