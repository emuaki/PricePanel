var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

var ejs = require('ejs'),
    stylus = require('stylus') ,
    nib = require('nib');

console.log(__dirname);

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
app.set('views', __dirname + '/views');

var config = require('config').create(app, io);
config.configure();

var priceSettings = require('models/price_settings').values;

require('services/price_service').getService().start();
require('services/bar_service').getService().start();
var sessionManager = require('sessions/session_manager').create({io : io});

sessionManager.start();


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

app.get('/barData', function(req, res){
    var barType = req.query.barType;
    var currencyPair = req.query.currencyPair;
    var service = require('services/bar_service').getService();
    var bars = service.find(barType, currencyPair);
    res.send(JSON.stringify(bars));
});


