var PricePublisher = function(io, rateSource){
    this.initialize(io, rateSource);
};

PricePublisher.prototype = {
    
    initialize : function(io, rateSource){
        this.io = io;
        this.rateSource = rateSource;
    },
    
    start : function(){
        console.log("PricePublisher.start");
        var self = this;
        this.rateSource.start();
        this.rateSource.on('data', function(price){
            self.publish(price);
        });
    },
    
    publish : function(price){
        console.log('publish' + price);
        this.io.sockets.emit('price', price);
    }
    
};

exports.createPricePublisher = function(){
    return new PricePublisher(arguments[0], arguments[1]);   
};
