
var ClientSession = function(args){
    this.initialize(args);
};

ClientSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.initialSend();
        this.setupPriceListener();
        this.setupBarListener();
        this.setupChatListener();
    },
    
    getPricePublisher : function(){
        return this.sessionManager.pricePublisher;
    },
    
    getBarPublisher : function(){
        return this.sessionManager.barPublisher;
    },
    
    initialSend : function(){
        this.socket.emit('notification', { 
            message : 'connected',
            connectionCount: this.sessionManager.connectionCount,
            transport : this.socket.transport
        });

        this.socket.emit('price', this.getPricePublisher().latestPrices());
    },
    
    setupChatListener : function(){
        var self = this;
        this.socket.on('chatMessage', function (data) {
            console.log('I received a private message by ', data);
            self.socket.emit('chatMessage',{message:data.message});
            self.socket.broadcast.emit('chatMessage', { message : data.message });
        });
    },
    
    setupPriceListener : function(){
        var self = this;
        this.getPricePublisher().on('price', function(prices){
            self.socket.emit('price', prices);
        });
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



var ClientSessionManager = function(option){
    this.initialize(option);
};

ClientSessionManager.prototype = {
    
    sessions : {},
    
    initialize : function(option){
        this.io = option.io;
        this.pricePublisher = option.pricePublisher;
        this.barPublisher = option.barPublisher;
        this.connectionCount = 0;
    },
    
    start : function(){
        var self = this;
        self.io.sockets.on('connection', function (socket) {

            self.connectionCount++;
            self.addSession(new ClientSession({socket: socket, sessionManager : self}));
            socket.broadcast.emit('connectionCountChange', { 
                message : 'connected',
                connectionCount: self.connectionCount
            });
            
            socket.on('disconnect', function(){
                self.removeSession(socket.id);
                socket.broadcast.emit('connectionCountChange', { 
                    message : 'disconnected',
                    connectionCount: self.connectionCount
                });
            });
        });
        
    },
    
    addSession : function(session){
        this.sessions[session.id] = session;
    },
    
    removeSession : function(id){
        delete this.sessions[id];
    }
};

exports.create = function(){
    return new ClientSessionManager(arguments[0], arguments[1]);   
};



