var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

app.use(express.static(__dirname + '/public'));

var priceSettings = require('price_settings');
var priceSimulator = require('price_simulator').createPriceSimulator(io, priceSettings);
priceSimulator.start();
