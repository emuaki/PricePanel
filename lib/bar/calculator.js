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
        console.log('tickCalculator: ' +  tick);
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
    var bars = this.container.find(currencyPair);
    var result = [];
    for(var i in bars){
        result.push([bars[i].timestamp, bars[i].price - 0]);
    }
    return result;
};

exports.createTickCalculator = function(rateSource){
    return new TickCalculator(rateSource);   
};
