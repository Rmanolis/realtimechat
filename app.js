
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var settings = require('./settings');
var models = settings.models();
var MongoStore = require('connect-mongo')(express);


var app = express();




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/chat'
    }),
    secret: 'superTopSecret'
}));
/*app.use(function(req,res,next){
    var ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    models.User.model.findOne({ip: ip}, function (err, data) {
        if (data && data.isBlocked == true) {
            res.end();
        } else {
            next();
        }
    });



});*/
app.use(app.router);



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var server = http.createServer(app).listen(app.get('port'), function(){

  console.log('Express server listening on port ' + app.get('port'));
});

app.io = require('socket.io').listen(server);

var home = require('./routes/index')(models,app.io);
var admin = require('./routes/administration')(models,app.io);


app.get('/', home.index);
app.post('/send/message',home.sendMessage);
app.post('/add/user',home.addUser);
app.post('/is/user',home.isUser);
app.get('/show/latest/Messages',home.getLatestMessages);
app.get('/show/latest/dedications',home.getLatestDedications);

//for administration

app.get('/admin',admin.index);
app.get('/show/all/messages',admin.getAllMessages);
app.get('/show/all/dedications',admin.getAllDedications);
app.get('/show/all/users',admin.getAllUsers);
app.get('/remove/all/messages',admin.removeAllMessages);
app.get('/remove/all/dedications',admin.removeAllDedications)
app.get('/remove/all/users',admin.removeAllUsers);
app.post('/remove/message',admin.removeMessage);
app.post('/remove/dedication',admin.removeDedication);
app.post('/remove/user',admin.removeUser);
app.post('/block/user',admin.blockUser);
app.post('/unblock/user',admin.unblockUser);

app.post('/accept/dedication',admin.acceptDedication);
//Todo block , unblock user
//accept Dedication

require('./chat')(app,models);
