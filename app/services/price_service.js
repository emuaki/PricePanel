var PriceService = function(args){
    this.initialize(args);
};

PriceService.prototype = {
    
    initialize : function(args){
        this.io = args.io;
        this.rateSource = require('fx_street/fx_street').create();
        // var rateSource = require('simulator/price_simulator').create();
        
        this.pricePublisher = require('price_publisher').create(this.rateSource);
    },
    
    start : function(){

        this.pricePublisher.start();
    }

};

var priceService = new PriceService();
exports.getService = function(){
    return priceService;   
};
