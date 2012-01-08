var calculator = require('services/bar_calculator'),
    util = require('util'),
    events = require('events'),
    BarType = require('models/bar').BarType;

var BarService = function(){    
    this.initialize();
};

util.inherits(BarService, events.EventEmitter);
BarService.prototype.calculators  = {};
    
BarService.prototype.initialize = function(){
    this.rateSource = require('services/price_service').getService().rateSource;
};

    
BarService.prototype.start = function(){
    var tickCalculator = calculator.createCalculator(BarType.TICK, this.rateSource);
    this.calculators[BarType.TICK] = tickCalculator;
    tickCalculator.start();

    var oneMinCalculator = calculator.createCalculator(BarType.ONE_MIN, tickCalculator.container );
    this.calculators[BarType.ONE_MIN] = oneMinCalculator;
    oneMinCalculator.start();
    
    console.log("BarService start.");
    
    var self = this;
    tickCalculator.on('bar', function(bar){
        self.emit('bar', bar);
    });
    
    oneMinCalculator.on('bar', function(bar){
        self.emit('bar', bar);
    });
};
    
BarService.prototype.find =function(barType, currencyPair, size){
    var calculator = this.calculators[barType];
    var bars = calculator.find(currencyPair, 30);
    return bars;
};

var barService = new BarService();
exports.getService = function(){
    return barService;   
};
