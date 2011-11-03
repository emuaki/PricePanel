var ConnectionStatus = function(socket, selector){
    this.initialize(socket, selector);  
};

ConnectionStatus.prototype = {
    
    initialize : function(socket, selector){
        this.socket = socket;
        this.ele = $(selector);
    },
    
    start : function(){
        var self = this;
        this.socket.on('connecting', function(){
            self.ele.html('connecting');
        });
        
        this.socket.on('connect', function(){
            self.ele.html('connect');
        });

        this.socket.on('connect_faild', function(){
            self.ele.html('connect_faild');
        });

        this.socket.on('reconnecting', function(){
            self.ele.html('reconnecting');
        });
        
        this.socket.on('reconnect_faild', function(){
            self.ele.html('reconnect_faild');
        });

        this.socket.on('disconnect', function(){
            self.ele.html('disconnect');
        });
        
    }
    
};