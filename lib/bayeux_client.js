var http = require('http'),
    util = require('util'),
    events = require('events');

var BayeuxClient = function(settings){
    events.EventEmitter.call(this);
    this.initialize(settings);
};

util.inherits(BayeuxClient, events.EventEmitter);

BayeuxClient.prototype.handshakeConnectInfo = {
    host : "ttpush.fxstreet.jp",
    port : 80,
    path : "/http_push/handshake?message=",
    method: "GET"
};
    
BayeuxClient.prototype.connectInfo = {
    host : "ttpush.fxstreet.jp",
    port : 80,
    path : "/http_push/connect",
    method: "POST"
};
    
BayeuxClient.prototype.STATE = {
    "UNCONNECTED" : 0,
    "CONNECTING" : 1,
    "CONNECTED" : 2
};
    
BayeuxClient.prototype.currentState = null;
    
BayeuxClient.prototype.initialize = function(settings){
    this.settings = settings;
    this.currentState = this.STATE.UNCONNECTED;
};
    
BayeuxClient.prototype.start = function(){
    this.handshake(this.connect);
};
    
BayeuxClient.prototype.handshake = function(next){
    var self = this;
    this.handshakeConnectInfo.path += this.settings.token;
    var req = http.request(this.handshakeConnectInfo, function(res){
        res.on('data', function(data){
            var result = self.getJson(data.toString());
            console.log("handshake result: " + JSON.stringify(result));
            self.id = result.id;
            self.clientId = result.clientId;
            next.call(self);
        });
    });
    req.end();
};
    
BayeuxClient.prototype.getJson = function(data){
    var jsonStr = data.toString().replace(/[(|)]/g, "");
    var json;
    try{
         json = JSON.parse(jsonStr);
    }catch(e){
        return {};
    }
    return json[0];
};
    
BayeuxClient.prototype.connect = function(){
    var self = this;
    var req = http.request(this.connectInfo, function(res){
        res.on('data', function(data){
            var result = self.getJson(data);
            
            if(self.currentState != self.STATE.CONNECTED ){
                self.emit('connected');
                self.currentState = self.STATE.CONNECTED;
                return;
            }
            
            self.emit('data', result);
        });
    
        res.on('end', function(d){
            console.log('reconnect');
            setTimeout( function(){ 
                self.connect(); 
            }, 1000);
        });
    });
    this.id++;
    var payload = [{
        "channel" : "/meta/connect",
        "connectionType" : "forever-response",
        "id" : this.id,
        "clientId" : this.clientId
    }];
        
    req.write(JSON.stringify(payload));
    req.end();
};


BayeuxClient.prototype.subscribe = function(channel){
    var self = this;   
    var req = http.request(this.connectInfo, function(res){
        res.on('data', function(data){
            var result = self.getJson(data);
            console.log("subscribe result: ", result);
        });
    });
    this.id++;
    var payload = '[{"channel":"/meta/subscribe","subscription":"'+ channel + '","id":"' + this.id + '","clientId":"' + this.clientId + '"}]';

    req.write(payload);
    req.end();    
};
    
BayeuxClient.prototype.unsubscribe = function(){
        
};
    
exports.create = function(){
    return new BayeuxClient(arguments[0]);   
};


