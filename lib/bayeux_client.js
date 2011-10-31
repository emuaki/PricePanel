var http = require('http');

var BayeuxClient = function(settings){
    this.initialize(settings);
};

BayeuxClient.prototype = {
    
    listeners : {},
    
    initialize : function(settings){

    },
    
    start : function(){
        this.handshake();
        this.connect();
    },
    
    handshake : function(){
        
    },
    
    connect : function(){
    
    },
    
    reconnect : function(){
        
    },
    
    subscribe : function(){
        
    },
    
    unsubscribe: function(){
        
    }
    
};





