
var ChatSession = function(args){
    this.initialize(args);
};

ChatSession.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.id = this.socket.id;
        this.setupListener();
    },

    setupListener : function(){
        var self = this;
        this.socket.on('chatMessage', function (data) {
            console.log('I received a private message by ', data);
            self.socket.emit('chatMessage',{message:data.message});
            self.socket.broadcast.emit('chatMessage', { message : data.message });
        });
    }

};


