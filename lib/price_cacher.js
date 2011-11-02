var PriceCacher = function(){
    this.initialize();
};

PriceCacher.prototype = {
    
    initialize : function(){
        this.cache = {};
    },
    
    put : function(key, value){
        this.cache[key] = value;
    },
    
    get : function(key){
        if(this.cache[key] === undefined){
            return null;
        }
        return this.cache[key];
    },
    
    findAll : function(){
        var array = [];
        for(var i in this.cache){
            array.push(this.cache[i]);
        }
        return array;
    }
    
};

exports.create = function(){
    return new PriceCacher();   
};

