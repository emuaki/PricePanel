var util = require('util'),
    events = require('events');

var PriceSimulator = function(){
    this.initialize();
};

util.inherits(PriceSimulator, events.EventEmitter);

PriceSimulator.prototype.initialize = function(){
    this.settings = require('simulator/price_settings').values; 
};
    
PriceSimulator.prototype.start = function(){
    for(var i in this.settings){
        this.publish(this.settings[i]);
    }
    console.log("PriceSimulator.start");
};
    
PriceSimulator.prototype.publish = function(setting){
    var self = this;
    setInterval(function(){
        self.doPublish(setting);
    }, setting.interval);
};
        
PriceSimulator.prototype.doPublish = function(setting){
    var price = require('price').create({
        currencyPair : setting.currencyPair,
        bid : setting.nextBid(),
        ask : setting.nextAsk()
    });
    this.emit('data', price);
};

exports.create = function(){
    return new PriceSimulator(arguments[0], arguments[1]);   
};