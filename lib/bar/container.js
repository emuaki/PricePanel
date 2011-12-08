var util = require('util');
var BarType = require('bar/bar').BarType;

var ContainerBase = function(){    
  
};

ContainerBase.prototype = {
    
    maxQueueSize : 50,
    
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
    },
    
    findAll : function(){
        return this.queue;   
    }
    
};


var TickContainer = function(){
    this.queue = {};
};

util.inherits(TickContainer, ContainerBase);

TickContainer.prototype.maxQueueSize = 50;


var OneMinContainer = function(){
    this.queue = {};
};

util.inherits(OneMinContainer, ContainerBase);

OneMinContainer.prototype.maxQueueSize = 50;


var containers = {};
containers[BarType.TICK] = function(){ return new TickContainer(); };
containers[BarType.ONE_MIN] = function(){ return new OneMinContainer(); };

exports.createContainer = function(barType){
    return containers[barType]();
};

