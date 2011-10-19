var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

require.paths.push('lib');
console.log(require.paths);

app.use(express.static(__dirname + '/public'));

var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

var hostname = "http://floating-earth-4631.herokuapp.com/";
// var hostname = "http://pricepanel.dev.cloud9ide.com/";
app.configure('production', function() {
    hostname = "http://young-robot-5461.herokuapp.com/";
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
    res.render('mobile.ejs', { locals: {hostname : hostname} });
});

io.sockets.on('connection', function (socket) {
    socket.emit('notification', { message : 'connected' });
    console.log("new connection"); 
});
