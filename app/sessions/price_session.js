
var PriceSession = function(args){
    this.initialize(args);
};

PriceSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.service = require('services/price_service').getService();
        this.setupPriceListener();
        this.socket.emit('price', this.getPublisher().latestPrices());
    },
    
    getPublisher : function(){
        return this.service.pricePublisher;
    },

    setupPriceListener : function(){
        var self = this;
        this.getPublisher().on('price', function(prices){
            self.socket.emit('price', prices);
        });
    }
    
};

exports.create = function(args){
    return new PriceSession(args);   
};

