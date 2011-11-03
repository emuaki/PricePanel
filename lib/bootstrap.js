var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

var ejs = require('ejs'),
    stylus = require('stylus') ,
    nib = require('nib');

app.use(express.static(__dirname + '/../public'));
function compile(str, path){
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

app.use(stylus.middleware({src: __dirname + '/public', compile: compile}));
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/../views');

var config = require('config').create(app, io);
config.configure();

var priceSettings = require('price_settings').values;

app.get('/', function(req, res){
    res.render('mobile/index.ejs', {
        locals: {
            hostname : config.hostname,
            priceSettings : priceSettings
        } 
    });
});

app.get('/mobile', function(req, res){
    res.render('mobile/index.ejs', {
        locals: {
            hostname : config.hostname,
            priceSettings : priceSettings
        } 
    });
});

app.get('/detail', function(req, res){
    res.render('mobile/detail.ejs', {
        locals: {
            hostname : config.hostname,
            priceSettings : priceSettings
        } 
    });
});


var fxStreet = require('fx_street').create();
var pricePublisher = require('price_publisher').create(io, fxStreet);
pricePublisher.start();

var connectionCount = 0;
io.sockets.on('connection', function (socket) {

    connectionCount++;
    
    socket.emit('notification', { 
        message : 'connected',
        connectionCount: connectionCount,
        transport : socket.transport
    });
    
    socket.emit('price', pricePublisher.latestPrices());
    
    socket.broadcast.emit('connectionCountChange', { 
        message : 'connected',
        connectionCount: connectionCount
    });

    socket.on('chatMessage', function (data) {
        console.log('I received a private message by ', data);
        socket.emit('chatMessage',{message:data.message});
        socket.broadcast.emit('chatMessage', { message : data.message });
    });
    
    socket.on('disconnect', function(){
		connectionCount--;
        socket.broadcast.emit('connectionCountChange', { 
            message : 'disconnected',
            connectionCount: connectionCount
        });
	});
    
});


