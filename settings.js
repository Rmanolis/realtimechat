/**
 * Created by manos on 11/19/13.
 */

var mongoose = require( 'mongoose' );
console.log('required');
exports.mongoose = mongoose;
mongoose.connect('mongodb://localhost:27017/chat');
exports.db = mongoose.connection;

var Dedication = require('./models/Dedication')();
var Message = require('./models/Message')();
var User = require('./models/User')();
var models = {
    Dedication: Dedication,
    Message: Message,
    User : User
};

exports.models = function(){
    return models;
}


