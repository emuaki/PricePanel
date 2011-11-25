var calculator = require('bar/calculator');
var BarType = require('bar/bar').BarType;

var BarManager = function(rateSource){    
    this.initialize(rateSource);
};

BarManager.prototype = {
    
    calculators : {},
    
    initialize : function(rateSource){
        this.rateSource = rateSource;
    },
    
    start : function(){
        var tickCalculator = calculator.createTickCalculator(this.rateSource);
        this.calculators[BarType.TICK] = tickCalculator;
        tickCalculator.start();
        console.log("BarManager start.");
    },
    
    find : function(barType, currencyPair){
        var calculator = this.calculators[barType];
        return calculator.find(currencyPair);
    }
    
};


exports.create = function(rateSource){
    return new BarManager(rateSource);   
};
