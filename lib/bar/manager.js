var calculator = require('lib/bar/calculator');

var BarManager = function(){    
  
};

BarManager.prototype = {
    
    
    start : function(){
        var tickCalculator = calculator.createTickCalculator();
        tickCalculator.start();
    }
    
};



exports.create = function(){
    return new BarManager();   
};
