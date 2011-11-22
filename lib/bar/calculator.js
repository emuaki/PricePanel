var util = require('util');

var CalculatorBase = function(){    
  
};

CalculatorBase.prototype = {
    
    initialize : function(rateSource){
        this.rateSource = rateSource;
    },
    
    start : function(){
        
    }
    
};


var TickCalculator = function(rateSource){
    this.initialize(rateSource);
    this.container = require('container').createTickContainer();
};

util.inherits(TickCalculator, CalculatorBase);

TickCalculator.prototype.start = function(){
    
    this.rateSource.on('data', function(price){
        console.log('tickCalculator' +  price);
        this.container.put(price);
    });

};

TickCalculator.prototype.find = function(currencyPair){
    this.container.find(currencyPair);
};

exports.createTickCalculator = function(rateSource){
    return new TickCalculator(rateSource);   
};
