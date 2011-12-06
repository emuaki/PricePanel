var util = require('util');

var ContainerBase = function(){    
  
};

ContainerBase.prototype = {
    
    queue : {},
    
    put : function(bar){
        var currencyPair = bar.currencyPair;
        if(this.queue[currencyPair] === undefined){
            this.queue[currencyPair] = [];
        }
        this.queue[currencyPair].push(bar);
        this.adjust(currencyPair);
    },
    
    adjust : function(currencyPair){
        var currentSize = this.queue[currencyPair].length;
        if(currentSize > this.maxQueueSize){
            this.queue[currencyPair].shift();
        }
    },
    
    find : function(currencyPair){
        return this.queue[currencyPair];
    }
    
};


var TickContainer = function(){
    
};

util.inherits(TickContainer, ContainerBase);

TickContainer.prototype.maxQueueSize = 50;


var OneMinContainer = function(){
    
};

util.inherits(OneMinContainer, ContainerBase);

OneMinContainer.prototype.maxQueueSize = 50;


exports.createTickContainer = function(){
    return new TickContainer();   
};

