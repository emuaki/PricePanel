var util = require('util'),
    events = require('events'),
    bar = require('models/bar'),
    BarType = require('models/bar').BarType,
    DateUtil = require('date').DateUtil;

var CalculatorBase = function(){    
  
};

util.inherits(CalculatorBase, events.EventEmitter);

CalculatorBase.prototype.initialize = function(dataSource){
    this.dataSource = dataSource;
};

CalculatorBase.prototype.find = function(currencyPair, size){
    return this.container.find(currencyPair, size);
};


var TickCalculator = function(dataSource){
    this.initialize(dataSource);
    this.container = require('services/bar_container').createContainer(BarType.TICK);
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
    this.container = require('services/bar_container').createContainer(BarType.ONE_MIN);
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
    var from  = DateUtil.getOneMinBaseTime(DateUtil.currentDate()); 
    var to = DateUtil.addSecond(new Date(from), 59);
    console.log("OneMinCalculator#doCalc. from:" + from + ", " + to);
    var queues = this.dataSource.findByTime(from , to);
    for(var i in queues){
        var bar = this.createBar(from, queues[i]);
        if(bar === null) continue;
        
        this.container.put(bar);
        console.log(bar);
        this.emit('bar', bar);
    }
};

OneMinCalculator.prototype.createBar = function(timestamp, queue){
    var first = true;
    var currencyPair, openPrice, highPrice, lowPrice, closePrice;
    
    for(var i in queue){
        if(queue[i] === undefined) continue;
        if(queue[i].length <= 0) continue;
        
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
    
    if(undefined === currencyPair){
        return null;
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
