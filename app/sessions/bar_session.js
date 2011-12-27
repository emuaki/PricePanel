
var BarSession = function(args){
    this.initialize(args);
};

BarSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.initialSend();
        this.setupBarListener();
    },
    
    getBarPublisher : function(){
        return this.sessionManager.barPublisher;
    },
    
    initialSend : function(){
        this.socket.emit('price', this.getPricePublisher().latestPrices());
    },
    

    subscribeBarCurrencies : [],
    
    isBarPublishTarget : function(bar){
        for(var i in this.subscribeBarCurrencies){
            var ccy = this.subscribeBarCurrencies[i];
            if(bar.currencyPair == ccy){
                return true;
            }
        }
        return false;
    },
    
    setupBarListener : function(){
        var self = this;
        var callback = function(bar){
            if(! self.isBarPublishTarget(bar)){
                return;
            }
            self.socket.emit('bar', bar);
        };
        this.socket.on('barSubscribe', function(currencies){
            self.subscribeBarCurrencies = currencies;
            self.getBarPublisher().on('bar', callback);
        });
        
        this.socket.on('barUnsubscribe', function(){
            self.subscribeBarCurrencies = [];
            self.getBarPublisher().removeListener('bar', callback);
        });
    }
    
};


exports.create = function(args){
    return new BarSession(args);   
};

