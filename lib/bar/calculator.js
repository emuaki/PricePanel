var util = require('util'),
    events = require('events'),
    bar = require('bar/bar');

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
    this.container = require('bar/container').createTickContainer();
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
    this.initialize(rateSource);
    this.container = require('bar/container').createContainer(BarType.ONE_MIN);
};

exports.createTickCalculator = function(dataSource){
    return new TickCalculator(dataSource);   
};
