var PriceSetting = function(option){
    this.initialize(option);
};

PriceSetting.prototype = {
    
    initialize : function(option){
        this.currencyPair = option.currencyPair;
        this.difference = option.difference;  
        this.openingBid = option.openingBid;
        this.currentBid = this.openingBid;
        this.upperBid = option.upperBid;
        this.lowerBid = option.lowerBid;
        this.spread = option.spread;
        this.interval = option.interval;
    },
    
    nextBid : function(){
        this.currentBid += this.difference;
        if( this.isChange() ){
            this.difference = this.difference * -1;
        }
        return this.currentBid.toFixed(2);
    },
    
    isChange : function(){
        if(this.currentBid > this.upperBid){
            return true;
        }
        
        if(this.currentBid < this.lowerBid){
            return true;   
        }
        return false;
        
    },
    
    nextAsk : function(){
        return (this.currentBid + this.spread).toFixed(2);
    }
};


var priceSettings = {
    "USD/JPY" : new PriceSetting({
        currencyPair : "USD/JPY",
        difference : 0.01,
        openingBid : 76.81,
        upperBid : 86.00,
        lowerBid : 75.00,
        spread : 0.01,
        interval : 2000
    }),
    
    "EUR/JPY" : new PriceSetting({
        currencyPair : "EUR/JPY",
        difference : 0.01,
        openingBid : 105.58,
        upperBid : 110.00,
        lowerBid : 100.00,
        spread : 0.01,
        interval : 1500
    }),
    
    "AUD/JPY" : new PriceSetting({
        currencyPair : "AUD/JPY",
        difference : 0.01,
        openingBid : 78.20,
        upperBid : 76.00,
        lowerBid : 80.00,
        spread : 0.01,
        interval : 2000
    }),
    
    "CHF/JPY" : new PriceSetting({
        currencyPair : "CHF/JPY",
        difference : 0.01,
        openingBid : 85.47,
        upperBid : 86.00,
        lowerBid : 80.00,
        spread : 0.01,
        interval : 2500
    }),
    
    "CAD/JPY" : new PriceSetting({
        currencyPair : "CAD/JPY",
        difference : 0.01,
        openingBid : 75.14,
        upperBid : 76.00,
        lowerBid : 740.00,
        spread : 0.01,
        interval : 3000
    }),
    
    "NZD/JPY" : new PriceSetting({
        currencyPair : "NZD/JPY",
        difference : 0.01,
        openingBid : 60.93,
        upperBid : 65.00,
        lowerBid : 55.00,
        spread : 0.01,
        interval : 8500
    }),
    "ZAR/JPY" : new PriceSetting({
        currencyPair : "ZAR/JPY",
        difference : 0.001,
        openingBid : 9.385,
        upperBid : 9.400,
        lowerBid : 9.00,
        spread : 0.01,
        interval : 5000
    }),
    
    "NOK/JPY" : new PriceSetting({
        currencyPair : "NOK/JPY",
        difference : 0.01,
        openingBid : 13.67,
        upperBid : 14.00,
        lowerBid : 12.00,
        spread : 0.01,
        interval : 8500
    }),
    
    "HKD/JPY" : new PriceSetting({
        currencyPair : "HKD/JPY",
        difference : 0.01,
        openingBid : 9.86,
        upperBid : 10.00,
        lowerBid : 9.00,
        spread : 0.01,
        interval : 3000
    }),
    
    "SEK/JPY" : new PriceSetting({
        currencyPair : "SEK/JPY",
        difference : 0.01,
        openingBid : 11.47,
        upperBid : 11.00,
        lowerBid : 12.00,
        spread : 0.01,
        interval : 8500
    })
    
};

exports.values = priceSettings;

