var calculator = require('bar/calculator');

var BarManager = function(pricePublisher){    
    this.initialize(pricePublisher);
};

BarManager.prototype = {
    
    initialize : function(pricePublisher){
        this.pricePublisher = pricePublisher;
    },
    
    start : function(){
        var tickCalculator = calculator.createTickCalculator();
        tickCalculator.start();
        console.log("BarManager start.");
    }
    
};


exports.create = function(pricePublisher){
    return new BarManager(pricePublisher);   
};
