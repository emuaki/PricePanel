var FxStreet = function(settings){
    this.initialize(settings);
};

FxStreet.prototype = {
    
    channels : {
        'USD/JPY' : '',
        'EUR/JPY' : ''
    },
    
    listeners : {},
    
    initialize : function(settings){

    },
    
    start : function(){
        this.handshake();
        this.connect();
    },
    

    
    subscribe : function(){
        
    }
    
};





