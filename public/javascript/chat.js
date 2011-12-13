var ChatPanel = function(option){
    this.initialize(option);   
};

ChatPanel.prototype = {
    
    initialize : function(option){
        this.socket = option.socket;
        this.sendButton = $("#" + option.sendButtonId);
        this.messageArea = $("#" + option.messageAreaId);
    },
    
    setupListener : function(){
        var self = this;
        this.sendButton.click(function(){
            self.send();
        });
        
        this.socket.on('chatMessage', function(data){
            self.onMessageReceive(data);   
        });
    },
    
    send : function(){
        var message = this.messageArea.val();
        this.socket.emit("chatMessage", {message : message});
        $.mobile.changePage("#chat", { transition: "slidedown"} );
        this.messageArea.val("");
    },
    
    onMessageReceive : function(data){
        $("#notificationMessage").remove();
        var list = jQuery("<li>" + data.message + "</li>");
        list.addClass("ui-li");
        list.addClass("ui-li-static");
        list.addClass("ui-body-c");
        $("#chatMessages").append(list);
    }
    
};

