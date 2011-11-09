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
    'EUR/JPY' : "/teletrader/symbols/3212165",
    'AUD/JPY' : "/teletrader/symbols/3212171",
    'CHF/JPY' : "/teletrader/symbols/3212200",
    'CAD/JPY' : "/teletrader/symbols/3212163",
    'NZD/JPY' : "/teletrader/symbols/3212268",
    'ZAR/JPY' : "/teletrader/symbols/3215365",
    'NOK/JPY' : "/teletrader/symbols/3212265",
    'HKD/JPY' : "/teletrader/symbols/3212641",
    'SEK/JPY' : "/teletrader/symbols/3212291"
};

FxStreet.prototype.requestInfo = {
    host : 'www.fxstreet.jp',
    port : 80,
    path : '/_ajax/token.aspx',
    method: 'GET'
};

FxStreet.prototype.channelToCurrencyCache = {};

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
            var extInfo = self.createExtInfo(d.toString());
            next.call(self, extInfo);
        });
    });
        
    req.end();
};

FxStreet.prototype.createExtInfo = function(tokenSource){
    var token = this.calcToken(tokenSource);
    var ext = {
        "teletrader" : {
            "SymbolFIDs" : "bid,ask,open,high,low,change,dateTime",
            "AuthToken" : token
        }
    };
    return ext;
};

FxStreet.prototype.calcToken = function(original){
    var tmp = original.replace(/\+/g, " ");   
    var token = encodeURI(tmp).replace(/:/g, "%3A").replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/%20/g, "%2B");
    return token;
};
    
FxStreet.prototype.bayeuxStart = function(extInfo){
    var self = this;
    this.bayeux = require('bayeux_client').create({
        ext : extInfo    
    });
    
    this.bayeux.on('connected', function(){
       console.log('bayeux connected.');
       self.subscribe();
    });
    
    this.bayeux.on('data', function(data){
       self.receive(data);
    });
    
    this.bayeux.start();
};
    
FxStreet.prototype.subscribe = function(){
    for(var i in this.channels){
        this.bayeux.subscribe(this.channels[i]);  
    }
};

FxStreet.prototype.receive = function(data){
    var currencyPair = this.getCurrencyPair(data.channel);
    if(currencyPair === null) return;

    var price = this.convert(data);
    this.emit('data', price); 
};

FxStreet.prototype.convert = function(data){
    var price = require('price').create({
        currencyPair : this.getCurrencyPair(data.channel),
        bid : data.data.bid,
        ask : data.data.ask
    });
    return price;
};

FxStreet.prototype.getCurrencyPair = function(channel){
    
    if(this.channelToCurrencyCache[channel] !== undefined){
        return this.channelToCurrencyCache[channel];
    }
    for(var i in this.channels){
        if(channel == this.channels[i]){
            this.channelToCurrencyCache[channel] = i;
            return i;
        }
    }
    return null;
};

exports.create = function(){
    return new FxStreet();   
};
