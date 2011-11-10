
BidAskType = {
    BID : 0,
    ASK :1
};

var BarBase = function(){    
  
};

BarBase.prototype = {
    
    currencyPair : null,
    
    bidAskType : null,
    
    startDateTime : null,
    
    openPrice : null,
    
    highPrice : null,
    
    lowPrice : null,
    
    closePrice : null
    
};


var Tick = function(){
    
};

util.inherits(Tick, BarBase);



var OneMin = function(){
    
    
};

util.inherits(OneMin, BarBase);


