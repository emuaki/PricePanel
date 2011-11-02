var Price = function(data){
    this.initialize(data);
};

Price.prototype = {
    
    currencyPair : "",
    
    bid : "",
    
    ask : "",
    
    high: "",
    
    low: "",
    
    change: "",
    
    timestamp: "",
    
    initialize : function(data){
        this.currencyPair = data.currencyPair || "";
        this.bid = data.bid || "";
        this.ask = data.ask || "";
    },
    
    toString : function(){
        return "currencyPaiir: " + this.currencyPair + ", bid: " + this.bid + ", ask: " + this.ask;
    }

};


exports.create = function(){
    return new Price(arguments[0]);   
};

