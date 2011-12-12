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
    
    find : function(currencyPair, size){
        var queue = this.queue[currencyPair];
        var i = queue.length - size;
        if(i < 0){
            i = 0;
        }
        var result = [];
        for(; i < queue.length; i++){
            result.push(queue[i]);
        }
        return result;
    },
    
    findByTime : function(from, to){
        var result = {};
        for(var i in this.queue){
            result[i] = this.extract(this.queue[i], from, to);
        }
        return result;
    },
    
    extract : function(queue, from , to){
        var result = [];
        for(var i in queue){
            if(i === undefined) continue;
            var bar = queue[i];
            console.log(bar.timestamp);
            var timestamp = bar.timestamp;
            if(timestamp >= from  && timestamp <= to){
                result.push(bar);
            }
        }
        return result;
    },
    
    findAll : function(){
        return this.queue;   
    }
    
};


var TickContainer = function(){
    this.queue = {};
};

util.inherits(TickContainer, ContainerBase);

TickContainer.prototype.maxQueueSize = 100;


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

