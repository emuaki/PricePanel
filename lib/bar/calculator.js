var util = require('util'),
    events = require('events'),
    bar = require('bar/bar');
    BarType = require('bar/bar').BarType;

var BarType = require('bar/bar').BarType;

var CalculatorBase = function(){    
  
};

util.inherits(CalculatorBase, events.EventEmitter);

CalculatorBase.prototype.initialize = function(dataSource){
    this.dataSource = dataSource;
};

CalculatorBase.prototype.find = function(currencyPair){
    return this.container.find(currencyPair);
};


var TickCalculator = function(dataSource){
    this.initialize(dataSource);
    this.container = require('bar/container').createContainer(BarType.TICK);
};

util.inherits(TickCalculator, CalculatorBase);

TickCalculator.prototype.start = function(){
    var self = this;
    this.dataSource.on('data', function(price){
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


var OneMinCalculator = function(dataSource){
    this.initialize(dataSource);
    this.container = require('bar/container').createContainer(BarType.ONE_MIN);
};

util.inherits(OneMinCalculator, CalculatorBase);

OneMinCalculator.prototype.calcInterval = 60 * 1000;

OneMinCalculator.prototype.start = function(){
    var self = this;
    setInterval(function(){
        self.doCalc();
    }, self.calcInterval);
    console.log("OneMinCalculator#start");
};

OneMinCalculator.prototype.doCalc = function(){
    console.log("OneMinCalculator#doCalc");
};

var calculators = {};
calculators[BarType.TICK] = function(dataSource){ return new TickCalculator(dataSource); };
calculators[BarType.ONE_MIN] = function(dataSource){ return new OneMinCalculator(dataSource); };
exports.createCalculator = function(barType, dataSource){
    return calculators[barType](dataSource);   
};
