var calculator = require('bar/calculator');

var BarManager = function(rateSource){    
    this.initialize(rateSource);
};

BarManager.prototype = {
    
    initialize : function(rateSource){
        this.rateSource = rateSource;
    },
    
    start : function(){
        var tickCalculator = calculator.createTickCalculator(this.rateSource);
        tickCalculator.start();
        console.log("BarManager start.");
    },
    
    find : function(barType, currencyPair){
        
    }
    
};


exports.create = function(rateSource){
    return new BarManager(rateSource);   
};
