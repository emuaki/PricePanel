var util = require('util');

var CalculatorBase = function(){    
  
};

CalculatorBase.prototype = {
    
    start : function(){
        
    }
    
};


var TickCalculator = function(){
    
};

util.inherits(TickCalculator, CalculatorBase);



exports.createTickCalculator = function(){
    return new TickCalculator();   
};
