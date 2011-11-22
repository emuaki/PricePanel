var util = require('util');

var ContainerBase = function(){    
  
};

ContainerBase.prototype = {
    
    queue : {},
    
    
    put : function(bar){
    
    },
    
    isSizeOver : function(){
        
    },
    
    adjust : function(){
        
    }
    
};


var TickContainer = function(){
    
};

util.inherits(TickContainer, ContainerBase);

TickContainer.prototype.maxQueueSize = 200;



exports.createTickContainer = function(){
    return new TickContainer();   
};

