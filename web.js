var app = require('express').createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/jquery.js', function (req, res) {
    res.sendfile(__dirname + '/jquery-1.6.4.min.js');
});

var priceSettings = require('price_settings');
var priceSimulator = require('price_simulator').createPriceSimulator(io, priceSettings);
priceSimulator.start();
