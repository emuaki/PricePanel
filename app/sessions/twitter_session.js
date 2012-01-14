
var TwitterSession = function(args){
    this.initialize(args);
};

TwitterSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.service = require('services/twitter_service').getService();
        this.initialSend();
        this.setupListener();
    },
    
    initialSend : function(){
    },
    
    setupListener : function(){
    }
    
};

exports.create = function(args){
    return new TwitterSession(args);   
};



