var util = require('util'),
    events = require('events');

var PricePublisher = function(rateSource){
    this.initialize(rateSource);
};

util.inherits(PricePublisher, events.EventEmitter);

PricePublisher.prototype.initialize = function(rateSource){
    this.rateSource = rateSource;
    this.priceCacher = require('services/price_cacher').create();
};

PricePublisher.prototype.start = function(){
    console.log("PricePublisher.start");
    var self = this;
    this.rateSource.start();
    this.rateSource.on('data', function(price){
        self.publish(price);
    });
};
    
PricePublisher.prototype.publish = function(price){
    // console.log('PricePublisher#publish: ' + price);
    this.priceCacher.put(price.currencyPair, price);
    var prices = [];
    prices.push(price);
    this.emit('price', prices);
};

PricePublisher.prototype.latestPrices = function(){
    return this.priceCacher.findAll();  
};

exports.create = function(){
    return new PricePublisher(arguments[0], arguments[1]);   
};
