var express = require('express');
var app = express.createServer(), io = require('socket.io').listen(app);
var port = process.env.PORT || process.env.C9_PORT;
app.listen(port);

app.use(express.static(__dirname + '/public'));

var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    // テンプレートに渡す変数
	var mes = "<p>hello world!</p>";
	res.render('index.html', {locals:{mes:mes}});
});

var priceSettings = require('price_settings');
var priceSimulator = require('price_simulator').createPriceSimulator(io, priceSettings);
priceSimulator.start();
