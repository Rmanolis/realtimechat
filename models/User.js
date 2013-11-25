/**
 * Created by manos on 11/20/13.
 */
module.exports = function () {
    var mongoose = require('../settings').mongoose;
    var UserSchema = new mongoose.Schema({
        nickname: String,
        ip: String,
        isBlocked: Boolean,
        socketID:String
    });

    var User = mongoose.model('User', UserSchema);

    var addUser = function (name, ip,callback) {
        User.findOne({ip: ip}, function (err, data) {
            if (data) {
                data.nickname = name;
                data.save(function(){
                    callback(data);
                    console.log('User updated nickname to '+ name)
                });
            } else {
                var user = new User({
                    nickname: name,
                    ip: ip,
                    isBlocked: false
                });

                user.save(function(){
                    callback(user);
                    console.log('User saved ' + name);

                });
            }
        });

    };

    var removeUser = function(ip){
        User.findOne({ip:ip},function(err,data){
            if(data){
                data.remove(function(){
                    console.log('User removed')
                });
            }
        })
    };

    var removeAllUsers = function(){
        User.remove({}, function(err) {
            console.log('Users removed');
        });
    }



    var blockIP = function(ip){
        User.findOne({ip: ip}, function (err, data) {
            if (data) {
               data.isBlocked = true;
               data.save();
            }
        });
    };

    var addID = function(ip,id){
        User.findOne({ip: ip}, function (err, data) {
            if (data) {
                data.socketID = id;
                data.save();
            }
        });
    }

    var unblockIP = function(ip){
        User.findOne({ip: ip}, function (err, data) {
            if (data) {
                data.isBlocked = false;
                data.save();
            }
        });
    }


    return{
        addUser: addUser,
        blockIP : blockIP,
        unblockIP : unblockIP,
        addID: addID,
        removeAllUsers : removeAllUsers,
        removeUser:removeUser,
        model: User
    }
}