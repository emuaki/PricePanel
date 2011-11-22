var util = require('util'),
    events = require('events');
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
    
    this.rateSource.on('data', function(price){
        console.log('tickCalculator' +  price);
        this.container.put(price);
        this.emit('bar', price);
    });

};

TickCalculator.prototype.convert = function(price){
    var tick = new bar.Tick();
    return tick;
};

TickCalculator.prototype.find = function(currencyPair){
    this.container.find(currencyPair);
};

exports.createTickCalculator = function(rateSource){
    return new TickCalculator(rateSource);   
};
