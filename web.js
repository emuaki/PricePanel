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



var http = require('http');

var getToken = {
  host : 'www.fxstreet.jp',
  port : 80,
  path : '/_ajax/token.aspx',
  method: 'GET'
};

var token = "";
var req = http.request(getToken, function(res){
   
   res.on('data',function(d){
      console.log("token is : " + d.toString());
      token = d.toString();
      requestHandshake(token);
   });
});

req.end();

function requestHandshake(token){
var replaced = token.replace(/\+/g, " ");    
var param1 = '[{"ext":{"teletrader":{"SymbolFIDs":"last,open,high,low,change,changePercent,dateTime","AuthToken":"' + replaced + '"}},"version":"1.0","minimumVersion":"0.9","channel":"/meta/handshake","supportedConnectionTypes":["long-polling"],"id":"1"}]';
var param2 = encodeURI(param1).replace(/:/g, "%3A").replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/%20/g, "%2B");
var path = '/http_push/handshake?message=' + param2;


var handshake = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : path,
  method: 'GET'
};

var req = http.request(handshake, function(res){
    
    res.on('data', function(d){
        var jsonStr = d.toString().replace(/[(|)]/g, "");
   
        var json = eval(jsonStr);
        console.log(json);
        requestConnect(json[0].id, json[0].clientId);
    });
});

req.end();

}

var subscribed = false;
function requestConnect(id, clientId){
 
var connect = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : "/http_push/connect",
  method: 'POST'
};

var req = http.request(connect, function(res){
  
    res.on('data', function(d){
        var jsonStr = d.toString().replace(/[(|)]/g, "");
   
        var json = eval(jsonStr);
        console.log(json);
        if(subscribed) return;
        
        requestSubscribe(json[0].id, json[0].clientId);
        subscribed = true;
    });
    
    res.on('end', function(d){
        console.log('reconnect');
        setTimeout(function(){ requestConnect(id, clientId)}, 1000);
    });
});

var payload = '[{"channel":"/meta/connect","connectionType":"forever-response","id":"' + id + '","clientId":"' + clientId + '"}]';
req.write(payload);

req.end();

}


function requestSubscribe(id, clientId){
  
var subscribe = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : "/http_push/",
  method: 'POST'
};


var req = http.request(subscribe, function(res){
    
    res.on('data', function(d){
        var jsonStr = d.toString().replace(/[(|)]/g, "");
   
        var json = eval(jsonStr);
        console.log(json);
        receiveData(json[0].id, json[0].clientId, json[0].subscription[0]);
    });
    

});  

var payload = '[{"channel":"/meta/subscribe","subscription":"/teletrader/symbols/3212164","id":"' + id + '","clientId":"' + clientId + '"}]';
req.write(payload);

req.end();


}


function receiveData(id, clientId, channel){

var subscribe = {
  host : 'ttpush.fxstreet.jp',
  port : 80,
  path : "/http_push/",
  method: 'POST'
};


var req = http.request(subscribe, function(res){
    
    res.on('data', function(d){
        var jsonStr = d.toString().replace(/[(|)]/g, "");
   
        var json = eval(jsonStr);
        console.log(json);
    });
    
    res.on('close', function(){
        console.log('end');   
    });
});  

var payload = '[{"channel": "'+ channel + '", "clientId": "' + clientId + '", "data": "some application string or JSON encoded object",  "id": "' + id + '"}]';
req.write(payload);

req.on('response', function(response){

    response.on('data', function(chunk){
        console.log('data');   
    });
    
    response.on('end', function(a){
        console.log('end'); 
    });
    
    response.on('error', function(e){
       console.log(e); 
    });
});
req.end();


    
}