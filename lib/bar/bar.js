var util = require('util');

var BarBase = function(){    
  
};

BarBase.prototype = {
    
    currencyPair : null,
    
    startDateTime : null,
    
    openPrice : null,
    
    highPrice : null,
    
    lowPrice : null,
    
    closePrice : null
    
};


var Tick = function(){
    
};

util.inherits(Tick, BarBase);

Tick.prototype.price = null;


var OneMin = function(){
    
    
};

util.inherits(OneMin, BarBase);

exports.Tick = Tick;

