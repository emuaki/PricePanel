
var StatusSession = function(args){
    this.initialize(args);
};

StatusSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.sessionManager = args.sessionManager;
        this.service = require('services/status_service').getService();
        this.service.plusConnectionCount();
        this.initialSend();
        this.setupListener();
    },
    
    initialSend : function(){
        var transport = "";
        if(this.socket.transport){
            transport = this.socket.transport;
        }
        this.socket.emit('notification', { 
            message : 'connected',
            connectionCount: this.service.connectionCount,
            transport : transport
        });
    },
    
    setupListener : function(){
        var self = this;
        this.socket.on('disconnect', function(){
            self.service.minusConnectionCount();
            self.broadcast.emit('connectionCountChange', { 
                message : 'disconnected',
                connectionCount: self.service.connectionCount
            });
        });   
    }
    
};



exports.create = function(args){
    return new StatusSession(args);   
};



