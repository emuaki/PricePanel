var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

var ejs = require('ejs'),
    stylus = require('stylus') ,
    nib = require('nib');

app.use(express.static(__dirname + '/../public'));
function compile(str, path){
    console.log(path);
    return stylus(str)
        .set('filename', path)
        .use(nib());
}

app.use(stylus.middleware({src: __dirname + '/../public', compile: compile}));
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
    var currencyPair = req.query.currencyPair;
    var key = currencyPair.replace("/", "");
    res.render('mobile/detail.ejs', {
        locals: {
            hostname : config.hostname,
            priceSettings : priceSettings,
            currencyPair : currencyPair,
            key : key
        } 
    });
});


var rateSource = require('fx_street/fx_street').create();
//var rateSource = require('simulator/price_simulator').create();
 
var pricePublisher = require('price_publisher').create(io, rateSource);
pricePublisher.start();

var barManager = require('bar/manager').create();
barManager.start(pricePublisher);

var clientSessionManager = require('client_session_manager').create(io, pricePublisher);
clientSessionManager.start();


