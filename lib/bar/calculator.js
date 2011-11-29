var util = require('util'),
    events = require('events'),
    bar = require('bar/bar');

var CalculatorBase = function(){    
  
};

util.inherits(CalculatorBase, events.EventEmitter);

CalculatorBase.prototype.initialize = function(rateSource){
    this.rateSource = rateSource;
};


var TickCalculator = function(rateSource){
    this.initialize(rateSource);
    this.container = require('bar/container').createTickContainer();
};

util.inherits(TickCalculator, CalculatorBase);

TickCalculator.prototype.start = function(){
    var self = this;
    this.rateSource.on('data', function(price){
        var tick = self.convert(price);
        self.container.put(tick);
        self.emit('bar', tick);
    });

};

TickCalculator.prototype.convert = function(price){
    var tick = new bar.Tick({
        currencyPair: price.currencyPair,
        price : price.bid,
        timestamp: price.timestamp
    });
    return tick;
};

TickCalculator.prototype.find = function(currencyPair){
    return this.container.find(currencyPair);
};

exports.createTickCalculator = function(rateSource){
    return new TickCalculator(rateSource);   
};
