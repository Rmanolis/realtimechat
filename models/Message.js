/**
 * Created by manos on 11/19/13.
 */

module.exports = function () {
    var settings = require('../settings')
    var mongoose = settings.mongoose;

    var MessageSchema = new mongoose.Schema({
        message: String,
        isDedicated: Boolean,
        nickname: String,
        date: Date
    });

    var Message = mongoose.model('Message', MessageSchema);

    var sendMessage = function (msg, nickname, isDed) {

        var message = new Message({
            message: msg,
            isDedicated: isDed,
            nickname: nickname,
            date: new Date()
        });



        message.save(function () {
            console.log('saved message');
        });
        return message;
    };

    var removeMessage = function (id) {
        Message.findOne({_id: id}, function (err, data) {
            if (err) {
                console.log("Message remove error with id : " + id + ' ' + err);
            } else {
                if (data !== null) {
                    data.remove(function (err) {
                        if (err) {
                            console.log('Message did not removed ' + id);
                        } else {
                            console.log('Message removed succesfully');
                        }
                    });
                }

            }
        });
    };

    var removeAllMessages = function(){
        Message.remove({}, function(err) {
            console.log('Messages removed');
        });
    };

    return{
        sendMessage: sendMessage,
        removeMessage: removeMessage,
        removeAllMessages : removeAllMessages,
        model: Message
    }
}