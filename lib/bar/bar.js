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

BarBase.prototype.initialize = function(data){
    this.currencyPair = data.currencyPair;
    this.timestamp = data.timestamp;
    this.openPrice = data.openPrice;
    this.highPrice = data.highPrice;
    this.lowPrice = data.lowPrice;
    this.closePrice = data.closePrice;
};

BarBase.prototype.toString = function(){
    var result = [];
    for(var i in this){
        if("string" != typeof this[i]){
            continue;
        }
        result.push(i + ": " + this[i] + ", ");
    }
    return result.join();
};

var Tick = function(data){
    this.initialize(data);
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

var OneMin = function(data){
    this.initialize(data);
};

util.inherits(OneMin, BarBase);

exports.Tick = Tick;
exports.OneMin = OneMin;
exports.BarType = BarType;


