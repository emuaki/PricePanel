var http = require('http');
var bayeuxClient = require('bayeux_client');

var FxStreet = function(settings){
    this.initialize(settings);
};

FxStreet.prototype = {
    
    channels : {
        'USD/JPY' : "/teletrader/symbols/3212164",
        'EUR/JPY' : "/teletrader/symbols/3212166"
    },

    requestInfo : {
        host : 'www.fxstreet.jp',
        port : 80,
        path : '/_ajax/token.aspx',
        method: 'GET'
    },
    
    listeners : {},
    
    initialize : function(settings){

    },
    
    start : function(){
        this.getToken(
            this.bayeuxStart);
    },
    
    getToken : function(next){
        var self = this;
        var req = http.request(this.requestInfo, function(res){
            res.on('data',function(d){
                console.log("token is : " + d.toString());
                token = self.calcToken(d.toString());
                next(token);
            });
        });
        
        req.end();
    },

    calcToken : function(original){
        var one = original.replace(/\+/g, " ");    
        var two= '[{"ext":{"teletrader":{"SymbolFIDs":"last,open,high,low,change,changePercent,dateTime","AuthToken":"' + one + '"}},"version":"1.0","minimumVersion":"0.9","channel":"/meta/handshake","supportedConnectionTypes":["long-polling"],"id":"1"}]';
        var three = encodeURI(two).replace(/:/g, "%3A").replace(/,/g, "%2C").replace(/\//g, "%2F").replace(/%20/g, "%2B");
        return three;
    },
    
    bayeuxStart : function(token){
        console.log("bayeux start.");
    },
    
    subscribe : function(){
        
    }
    
};

exports.create = function(){
    return new FxStreet();   
};
