var util = require('util');

var CalculatorBase = function(){    
  
};

CalculatorBase.prototype = {
    
    initialize : function(dataSource){
        this.dataSource = dataSource;
    },
    
    start : function(){
        
    }
    
};


var TickCalculator = function(dataSource){
    this.initialize(dataSource);
};

util.inherits(TickCalculator, CalculatorBase);

TickCalculator.prototype.start = function(){
    
};


exports.createTickCalculator = function(){
    return new TickCalculator();   
};
