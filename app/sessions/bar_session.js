
var BarSession = function(args){
    this.initialize(args);
};

BarSession.prototype = {

    subscribeCurrencies : [],

    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.setupListener();
    },
    
    getPublisher : function(){
        return this.sessionManager.barPublisher;
    },
 
    isBarPublishTarget : function(bar){
        for(var i in this.subscribeCurrencies){
            var ccy = this.subscribeCurrencies[i];
            if(bar.currencyPair == ccy){
                return true;
            }
        }
        return false;
    },
    
    setupListener : function(){
        var self = this;
        var callback = function(bar){
            if(! self.isBarPublishTarget(bar)){
                return;
            }
            self.socket.emit('bar', bar);
        };
        this.socket.on('barSubscribe', function(currencies){
            self.subscribeCurrencies = currencies;
            self.getPublisher().on('bar', callback);
        });
        
        this.socket.on('barUnsubscribe', function(){
            self.subscribeCurrencies = [];
            self.getPublisher().removeListener('bar', callback);
        });
    }
    
};


exports.create = function(args){
    return new BarSession(args);   
};

