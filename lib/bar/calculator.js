var util = require('util'),
    events = require('events'),
    bar = require('bar/bar'),
    BarType = require('bar/bar').BarType,
    DateUtil = require('date').DateUtil;

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
    var from  = DateUtil.getOneMinBaseTime(new Date());
    var to = DateUtil.addSecond(new Date(to), 59);
    console.log("!!!!!!!!" + from + "   " + to );
    var queues = this.dataSource.findByTime(from , to);
    for(var i in queues){
        var bar = this.createBar(queues[i]);
        this.container.put(bar);
        this.emit('bar', bar);
    }
};

OneMinCalculator.prototype.createBar = function(queue){
    var first = true;
    var timestamp = DateUtil.currentDateAsString();
    var currencyPair, openPrice, highPrice, lowPrice, closePrice;
    for(var i in queue){
        if(queue[i] === undefined) continue;
        
        currencyPair = queue[i].currencyPair;
        var currentPrice = queue[i].price;
        if(first){
            openPrice = currentPrice;
            first = false;
        }
        if(highPrice === undefined || highPrice < currentPrice){
            highPrice = currentPrice;
        }
        if(lowPrice === undefined || lowPrice > currentPrice){
            lowPrice = currentPrice;
        }
        closePrice = currentPrice;
    }
    
    var oneMin = new bar.OneMin({
        currencyPair : currencyPair,
        timestamp : timestamp,
        openPrice : openPrice,
        highPrice : highPrice,
        lowPrice : lowPrice,
        closePrice : closePrice
    });
    
    return oneMin;
};

var calculators = {};
calculators[BarType.TICK] = function(dataSource){ return new TickCalculator(dataSource); };
calculators[BarType.ONE_MIN] = function(dataSource){ return new OneMinCalculator(dataSource); };
exports.createCalculator = function(barType, dataSource){
    return calculators[barType](dataSource);   
};
