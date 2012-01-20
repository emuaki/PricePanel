var ConnectionStatus = function(socket, selectors){
    this.initialize(socket, selectors);  
};

ConnectionStatus.prototype = {
    
    initialize : function(socket, selectors){
        this.socket = socket;
        this.status = $(selectors.status);
        this.count = $(selectors.count);
    },
    
    start : function(){
        $.mobile.showPageLoadingMsg();
        
        var self = this;
        this.socket.on('connecting', function(){
            self.status.html('connecting');
        });
        
        this.socket.on('connect', function(){
            self.status.html('connect');
        });

        this.socket.on('connect_faild', function(){
            self.status.html('connect_faild');
        });

        this.socket.on('reconnecting', function(){
            self.status.html('reconnecting');
        });
        
        this.socket.on('reconnect_faild', function(){
            self.status.html('reconnect_faild');
        });

        this.socket.on('disconnect', function(){
            self.status.html('disconnect');
        });
        
        this.socket.on('notification', function (data) {
            $.mobile.hidePageLoadingMsg();
            self.count.html(data.connectionCount);
        });
        
        this.socket.on('connectionCountChange', function (data) {
            self.count.html(data.connectionCount);
        });

    }
    
};
