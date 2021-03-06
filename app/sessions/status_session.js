
var StatusSession = function(args){
    this.initialize(args);
};

StatusSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.service = require('services/status_service').getService();
        this.service.plusConnectionCount();
        this.initialSend();
        this.setupListener();
    },
    
    initialSend : function(){
        this.socket.emit('notification', { 
            message : 'connected',
            connectionCount: this.service.connectionCount
        });
    },
    
    setupListener : function(){
        var self = this;
        this.socket.on('disconnect', function(){
            self.service.minusConnectionCount();
            self.socket.broadcast.emit('connectionCountChange', { 
                message : 'disconnected',
                connectionCount: self.service.connectionCount
            });
        });   
    }
    
};

exports.create = function(args){
    return new StatusSession(args);   
};



