var calculator = require('bar/calculator'),
    util = require('util'),
    events = require('events'),
    BarType = require('bar/bar').BarType;

var BarManager = function(rateSource){    
    this.initialize(rateSource);
};

util.inherits(BarManager, events.EventEmitter);
BarManager.prototype.calculators  = {};
    
BarManager.prototype.initialize = function(rateSource){
    this.rateSource = rateSource;
};

    
BarManager.prototype.start = function(){
    var tickCalculator = calculator.createCalculator(BarType.TICK, this.rateSource);
    this.calculators[BarType.TICK] = tickCalculator;
    tickCalculator.start();
    console.log("BarManager start.");
    
    var self = this;
    tickCalculator.on('bar', function(bar){
        self.emit('bar', bar);
    });
};
    
BarManager.prototype.find =function(barType, currencyPair){
    var calculator = this.calculators[barType];
    return calculator.find(currencyPair);
};


exports.create = function(rateSource){
    return new BarManager(rateSource);   
};
