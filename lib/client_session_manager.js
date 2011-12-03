
var ClientSession = function(args){
    this.initialize(args);
};

ClientSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.initialSend();
        this.setupListener();
    },
    
    getPricePublisher(){
        return this.sessionManager.pricePublisher;
    },
    
    getBarPublisher(){
        return this.sessionManager.barPublisher;
    },
    
    initialSend : function(){
        this.socket.emit('notification', { 
            message : 'connected',
            connectionCount: self.sessionManager.connectionCount,
            transport : this.socket.transport
        });
        
        this.socket.emit('price', getPricePublisher().latestPrices());
    },
    
    setupListener : function(){
        this.socket.on('chatMessage', function (data) {
            console.log('I received a private message by ', data);
            socket.emit('chatMessage',{message:data.message});
            socket.broadcast.emit('chatMessage', { message : data.message });
        });
        
        getBarPublisher().on('bar', function(bar){
            socket.emit('bar', bar);
        });
        
        getPricePublisher().on('price', function(prices){
            socket.emit('price', prices);
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
    
            self.addSession(new ClientSession({socket: socket, sessionManager : this}));

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
        delete this.session[id];
    }
};

exports.create = function(){
    return new ClientSessionManager(arguments[0], arguments[1]);   
};



