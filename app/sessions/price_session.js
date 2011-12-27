
var PriceSession = function(args){
    this.initialize(args);
};

PriceSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.initialSend();
        this.setupPriceListener();
        this.socket.emit('price', this.getPricePublisher().latestPrices());
    },
    
    getPricePublisher : function(){
        return this.sessionManager.pricePublisher;
    },

    setupPriceListener : function(){
        var self = this;
        this.getPricePublisher().on('price', function(prices){
            self.socket.emit('price', prices);
        });
    }
    
};

exports.create = function(args){
    return new PriceSession(args);   
};

