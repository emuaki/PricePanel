var http = require('http'),
    bayeuxClient = require('bayeux_client'),
    util = require('util'),
    events = require('events');

var FxStreet = function(settings){
    events.EventEmitter.call(this);
    this.initialize(settings);
};

util.inherits(FxStreet, events.EventEmitter);

FxStreet.prototype.channels = {
    'USD/JPY' : "/teletrader/symbols/3212155",
    'EUR/JPY' : "/teletrader/symbols/3212165"
};

FxStreet.prototype.requestInfo = {
    host : 'www.fxstreet.jp',
    port : 80,
    path : '/_ajax/token.aspx',
    method: 'GET'
};

FxStreet.prototype.initialize = function(settings){

};
    
FxStreet.prototype.start = function(){
    this.getToken(this.bayeuxStart);
};
    
FxStreet.prototype.getToken = function(next){
    var self = this;
    var req = http.request(this.requestInfo, function(res){
        res.on('data',function(d){
            console.log("token is : " + d.toString());
            token = self.calcToken(d.toString());
            next(token);
        });
    });
        
    req.end();
};

FxStreet.prototype.calcToken = function(original){
    var one = original.replace(/\+/g, " ");    
    var two= '[{"ext":{"teletrader":{"SymbolFIDs":"last,open,high,low,change,changePercent,dateTime","AuthToken":"' + one + '"}},"version":"1.0","minimumVersion":"0.9","channel":"/meta/handshake","supportedConnectionTypes":["long-polling"],"id":"1"}]';
    var three = encodeURI(two).replace(/:/g, "%3A").replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/%20/g, "%2B");
    return three;
};
    
FxStreet.prototype.bayeuxStart = function(token){
    console.log("bayeux start.");
};
    
FxStreet.prototype.subscribe = function(){
        
};
    

exports.create = function(){
    return new FxStreet();   
};
