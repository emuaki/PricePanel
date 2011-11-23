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

Tick.prototype.initialize = function(values){
    this.price = values.price;
    this.startDateTime = values;
};

var OneMin = function(){
    
    
};

util.inherits(OneMin, BarBase);

exports.Tick = Tick;

