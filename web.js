var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

require.paths.push('lib');
console.log(require.paths);

var ejs = require('ejs'),
    stylus = require('stylus') ,
    nib = require('nib');

app.use(express.static(__dirname + '/public'));
function compile(str, path){
    console.log(str + path);
    return stylus(str)
        .set('filename', path)
        .use(nib());
}
app.use(stylus.middleware({src: __dirname + '/public', compile: compile}));
    
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');


var hostname = "http://pricepanel.dev.cloud9ide.com/";
app.configure('production', function() {
    hostname = "http://floating-earth-4631.herokuapp.com/";
});

var priceSettings = require('price_settings').values;
var priceSimulator = require('price_simulator').createPriceSimulator(io, priceSettings);
priceSimulator.start();


app.get('/', function(req, res){
	res.render('index.ejs', {
        locals: {
            hostname : hostname,
            priceSettings : priceSettings
        } 
    });
});

app.get('/mobile', function(req, res){
    res.render('mobile/index.ejs', {
        locals: {
            hostname : hostname,
            priceSettings : priceSettings
        } 
    });
});

io.configure('production', function(){
    io.enable('browser client minification');
    io.enable('browser client gzip');
    io.set('transports', [
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
    ]);
});

var connectionCount = 0;
io.sockets.on('connection', function (socket) {

    connectionCount++;
    
    socket.emit('notification', { 
        message : 'connected',
        connectionCount: connectionCount,
        transport : socket.transport
    });
    
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


// http://www.fxstreet.jp/_ajax/token.aspx
var http = require('http');
var path = '/http_push/handshake?jsonp=jsonp1319760854057&message=%5B%7B%22ext%22%3A%7B%22teletrader%22%3A%7B%22SymbolFIDs%22%3A%22last%2Copen%2Chigh%2Clow%2Cchange%2CchangePercent%2CdateTime%22%2C%22AuthToken%22%3A%22Q8HMMR48H0UR2%2BmTjPEj030jRO3DTnGZy5okyqQt2grll1lvhXIEkweP%2BCRBAqsXBlcPbW5hTJhX%2FstMbcR7E9FKGC45RQx758i%2Fh9H0fGV4sds%2BgzezG1p4n3NTgrV%2Fkb6qmju%2FJwNt8if2%2FrwKDJGUVg64PV5QS2c%2BdSKIYRpBxMuUr1b9bMCh3dKF%2F%2BlORUlZh9AMPlc89ViJrF8zxOKi0viMeqSaSUbUiROiVfuIjSRKswVZh39ti1IpmCYb031sXSy9%2BYQXVf%2BrPgTiLW4%2BJY35%2FTZ9FP49wkWs9iByG9dIxUg9eJ42kLrv3Ldw7VReAUarb3xxMm3mUqqX2uzU5CLRtMY3HUJTWnjlRYKOXSPjzp%2BilnOhcM3caqL9W7AKF3EZoirHUh0M8p37aQXPwBCgFo99X9dWZlUogMd%2Bo26VfSgYhT9V1hy3rEna8ARse3XsBPjG3%2FgYwNPUDAGPsMKVnSZbAji%2F9za0XpbbfOsJhXsEEmte1cAUgY%2Bkd764rDhBYcIhaJb50%2B5qgLmYa%2B4H6Cs%2BqXolfqM%2FQIRB%2B3xU%2FbhXQaxbfuHXlxvQlwK0v2YG1keSd3KGQdEG8R7B70jd0Fo5CjkeDXqDHhcbySKKREcG05YzDSJ8lD%2FKh9fzj9g85YGLVd4AIrAaa3%2FXVDzcbDanP16KoSw6xTmCGi5b%2B7R28gy7UwPIv4tqfuWdebbQyNvQakEs%2F6b%2FfDk1UQd96GHFQGlnH97BjEmt9n8eszui1eJvsVIzRX%2Fkly3aHsBfhGET4tLYrxAnUQe8YimbtfzkbooBeh%2B7VG0LGPq5uYwkmGMEVDvhDgMq%2BJ9OzTuivMSIBBZ8cB3LWQ%3D%3D%22%7D%7D%2C%22version%22%3A%221.0%22%2C%22minimumVersion%22%3A%220.9%22%2C%22channel%22%3A%22%2Fmeta%2Fhandshake%22%2C%22supportedConnectionTypes%22%3A%5B%22xhr-streaming%22%2C%22hidden-iframe%22%2C%22callback-polling%22%2C%22long-polling%22%5D%2C%22id%22%3A%221%22%7D%5D'

var handshake = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : path,
  method: 'GET'
};

var req = http.request(handshake, function(res){
    console.log(res);
    console.log(res.statusCode);
    res.on('data', function(d){
        console.log(d.toString());   
    });
});

var connect = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : "/http_push/handshake",
  method: 'POST'
};


req.end();
