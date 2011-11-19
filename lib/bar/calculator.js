var CalculatorBase = function(){    
  
};

CalculatorBase.prototype = {
    

    
};


var TickCalculator = function(){
    
};

util.inherits(TickCalculator, CalculatorBase);



exports.createTickCalculator = function(){
    return new TickCalculator();   
};
