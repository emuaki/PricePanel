var calculator = require('bar/calculator'),
    util = require('util'),
    events = require('events'),
    BarType = require('bar/bar').BarType;

var BarManager = function(){    
    this.initialize();
};

util.inherits(BarManager, events.EventEmitter);
BarManager.prototype.calculators  = {};
    
BarManager.prototype.initialize = function(){
    this.rateSource = require('services/price_service').getService().rateSource;
};

    
BarManager.prototype.start = function(){
    var tickCalculator = calculator.createCalculator(BarType.TICK, this.rateSource);
    this.calculators[BarType.TICK] = tickCalculator;
    tickCalculator.start();

    var oneMinCalculator = calculator.createCalculator(BarType.ONE_MIN, tickCalculator.container );
    this.calculators[BarType.ONE_MIN] = oneMinCalculator;
    oneMinCalculator.start();
    
    console.log("BarManager start.");
    
    var self = this;
    tickCalculator.on('bar', function(bar){
        self.emit('bar', bar);
    });
    
    oneMinCalculator.on('bar', function(bar){
        self.emit('bar', bar);
    });
};
    
BarManager.prototype.find =function(barType, currencyPair, size){
    var calculator = this.calculators[barType];
    var bars = calculator.find(currencyPair, 30);
    return bars;
};


exports.create = function(rateSource){
    return new BarManager(rateSource);   
};
