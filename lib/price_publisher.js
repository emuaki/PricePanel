

var PricePublisher = function(io, rateSource){
    this.initialize(io, rateSource);
};

PricePublisher.prototype = {
    
    initialize : function(io, rateSource){
        this.io = io;
        this.rateSource = rateSource;
        this.priceCacher = require('price_cacher').create();
    },
    
    start : function(){
        console.log("PricePublisher.start");
        var self = this;
        this.rateSource.start();
        this.rateSource.on('data', function(price){
            self.publish(price);
        });
    },
    
    publish : function(price){
        console.log('PricePublisher#publish: ' + price);
        this.priceCacher.put(price.currencyPair, price);
        var prices = [];
        prices.push(price);
        this.io.sockets.emit('price', prices);
    },
    
    latestPrices : function(){
        return this.priceCacher.findAll();  
    }
    
};

exports.create = function(){
    return new PricePublisher(arguments[0], arguments[1]);   
};
