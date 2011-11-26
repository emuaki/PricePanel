


var ClientSessionManager = function(option){
    this.initialize(option);
};

ClientSessionManager.prototype = {
    
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
    
            socket.emit('notification', { 
                message : 'connected',
                connectionCount: self.connectionCount,
                transport : socket.transport
            });
    
            socket.emit('price', self.pricePublisher.latestPrices());
    
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
    }
};

exports.create = function(){
    return new ClientSessionManager(arguments[0], arguments[1]);   
};



