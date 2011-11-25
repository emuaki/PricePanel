var BarType = {
    TICK : 0,
    ONE_MIN: 1
};

var util = require('util');

var BarBase = function(){    
  
};

BarBase.prototype = {
    
    currencyPair : null,
    
    timestamp : null,
    
    openPrice : null,
    
    highPrice : null,
    
    lowPrice : null,
    
    closePrice : null
};


var Tick = function(values){
    this.initialize(values);
};

util.inherits(Tick, BarBase);

Tick.prototype.price = null;

Tick.prototype.initialize = function(data){
    this.currencyPair = data.currencyPair;
    this.price = data.price;
    this.timestamp = data.timestamp;
};

Tick.prototype.toString = function(){
    return "currencyPair:" + this.currencyPair + " ,price: " + this.price + " timestamp:" + this.timestamp;
};

var OneMin = function(){
    
    
};

util.inherits(OneMin, BarBase);

exports.Tick = Tick;
exports.BarType = BarType;


