
var StatusService = function(args){
    this.initialize(args);
};

StatusService.prototype = {
    
    connectionCount : 0,
    
    initialize : function(args){
        
    },
    
    plusConnectionCount : function(){
        this.connectionCount++;
    },
    
    minusConnectionCount : function(){
        this.connectionCount--;
    }
    
};

var statusService = new StatusService();
exports.getService = function(){
    return statusService;   
};
