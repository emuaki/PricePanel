var ConnectionStatus = function(socket, selector){
    this.initialize(socket, selector);  
};

ConnectionStatus.prototype = {
    
    initialize : function(socket, selector){
        this.socket = socket;
        this.ele = $(selector);
    },
    
    start : function(){
        this.socket.on('connecting', function(){
            this.ele.html('connecting');
        });
        
        this.socket.on('connect', function(){
            this.ele.html('connect');
        });

        this.socket.on('connect_faild', function(){
            this.ele.html('connect_faild');
        });

        this.socket.on('reconnecting', function(){
            this.ele.html('reconnecting');
        });
        
        this.socket.on('reconnect_faild', function(){
            this.ele.html('reconnect_faild');
        });

        this.socket.on('disconnect', function(){
            this.ele.html('disconnect');
        });
        
    }
    
};