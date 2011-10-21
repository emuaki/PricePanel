var ChatSender = function(socket, args){
    this.initialize(socket, args);
};

ChatSender.prototype = {
    initialize: function(socket, args){
        this.socket = socket;
        this.args = args;
    }
};


var ChatReceiver = function(socket, args){
    this.initialize(socket, args);
};
ChatReceiver.prototype = {
    
    initialize: function(socket, args){
        this.socket = socket;
        this.args = args;
    }
};