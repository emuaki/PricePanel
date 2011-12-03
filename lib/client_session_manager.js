
var ClientSession = function(args){
    this.initialize(args);
};

ClientSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.initialSend();
        this.seupListener();
    },
    
    initialSend : function(){
        this.socket.emit('notification', { 
            message : 'connected',
            connectionCount: self.connectionCount,
            transport : socket.transport
        });
        
    },
    
    setupListener : function(){
        
        
   
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
    
            new ClientSession({socket: socket, sessionManager : this});
            
            socket.emit('price', self.pricePublisher.latestPrices());
            
            self.barPublisher.on('bar', function(bar){
                socket.emit('bar', bar);
            });
    
            socket.broadcast.emit('connectionCountChange', { 
                message : 'connected',
                connectionCount: self.connectionCount
            });

            socket.on('chatMessage', function (data) {
                console.log('I received a private message by ', data);
                socket.emit('chatMessage',{message:data.message});
                socket.broadcast.emit('chatMessage', { message : data.message });
            });
    
            socket.on('disconnect', function(){
                self.connectionCount--;
                socket.broadcast.emit('connectionCountChange', { 
                    message : 'disconnected',
                    connectionCount: self.connectionCount
                });
	        });
    
        });
        
    },
    
    addSession : function(session){
        this.sessions[session.id] = session;
    }
};

exports.create = function(){
    return new ClientSessionManager(arguments[0], arguments[1]);   
};



