var util = require('util'),
    events = require('events');

var PriceSimulator = function(){
    this.initialize();
};

util.inherits(PriceSimulator, events.EventEmitter);

PriceSimulator.prototype.initialize = function(){
    this.settings = require('simulator/price_settings').values; 
};
    
PriceSimulator.prototype.start = function(){
    for(var i in this.settings){
        this.publish(this.settings[i]);
    }
    console.log("PriceSimulator.start");
};
    
PriceSimulator.prototype.publish = function(setting){
    var self = this;
    setInterval(function(){
        self.doPublish(setting);
    }, setting.interval);
};
        
PriceSimulator.prototype.doPublish = function(setting){
    var price = require('price').create({
        currencyPair : setting.currencyPair,
        bid : setting.nextBid(),
        ask : setting.nextAsk(),
        timestamp : this.currentDate()
    });
    this.emit('data', price);
};

PriceSimulator.prototype.currentDate = function(){
    var date = new Date();
    var yy = date.getYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();

    if (yy < 2000) { yy += 1900; }
    if (mm < 10) { mm = "0" + mm; }
    if (dd < 10) { dd = "0" + dd; }
    if (hh < 10) { hh = "0" + hh; }
    if (min < 10) { min = "0" + min; }
    if (ss < 10) { ss = "0" + ss; }

    var dateString = yy + "/" + mm + "/" + dd + " " + hh + ":" + min + ":" + ss;
    return dateString;
};

exports.create = function(){
    return new PriceSimulator(arguments[0], arguments[1]);   
};