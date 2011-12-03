
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
    
    subscribeBar : function(){
        var bar = arguments[0];
        this.socket.emit('bar', bar);
    },
    
    setupBarListener : function(){
        var self = this;
        this.socket.on('barSubscribe', function(){
            self.getBarPublisher().on('bar', self.subscribeBar);
        });
        
        this.socket.on('barUnsubscribe', function(){
            self.getBarPublisher().removeListener('bar', self.subscribeBar);
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



