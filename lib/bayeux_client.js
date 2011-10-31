var async = require('async');
var http = require('http'); 

var BayeuxClient = function(settings){
    this.initialize(settings);
};

BayeuxClient.prototype = {
    
    handshakeConnectInfo : {
        host : "ttpush.fxstreet.jp",
        port : 80,
        path : "/http_push/handshake",
        method: "GET"
    },
    
    connectInfo : {
        host : "ttpush.fxstreet.jp",
        port : 80,
        path : "/http_push/connect",
        method: "POST"
    },
    
    STATE : {
        
    },
    
    currentState : null,
        
    listeners : {},
    
    initialize : function(settings){
        
    },
    
    start : function(){
        async.series({
            "handshake" : this.handshake,
            "connect": this.connect,
            "subscribe": this.subscribe
        }, 
        function(results, error){
            console.log(results);
        });
    },
    
    handshake : function(callback){
        var self = this;
        var req = http.request(this.handshakeConnectInfo, function(res){
            res.on('data', function(data){
                var result = self.getJson(data.toString);
                console.log("handshake result: " + result);
                callback(result, null);
            });
        });
        req.end();
    },
    
    getJson : function(data){
        var jsonStr = data.toString().replace(/[(|)]/g, "");
        var json = eval(jsonStr);
        return json[0];
    },
    
    connect : function(callback){
        var req = http.request(connect, function(res){
            res.on('data', function(data){
                var result = getJson(data);
                console.log("connect result: ", result);
                callback(result, error);
            });
    
            res.on('end', function(d){
                console.log('reconnect');
                // setTimeout(function(){ requestConnect(id, clientId)}, 1000);
            });
        });
        
        var payload = '[{"channel":"/meta/connect","connectionType":"forever-response","id":"' + id + '","clientId":"' + clientId + '"}]';
        req.write(payload);
        req.end();
    },
    
    reconnect : function(){
        
    },
    
    subscribe : function(){
        var payload = '[{"channel":"/meta/subscribe","subscription":"'+ channel + '","id":"' + id + '","clientId":"' + clientId + '"}]';

    },
    
    unsubscribe: function(){
        
    }
    
};





