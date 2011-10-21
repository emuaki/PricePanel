var PricePublisher = function(socket, option){
    this.initialize(socket, option);
}

PricePublisher.prototype = {
    
    listenerMap : {},
    
	initialize : function(socket, option) {
		this.socket = socket;
        this.option = option;
        
        var self = this;
        this.socket.on('price', function (data) {
            self.onPrice(data);
        });
	},

	onPrice: function(data) {
		var listeners = this.listenerMap[data.currencyPair];
        for(var i in listeners){
            listeners[i].onPrice(data);
        }
	},
    
    addPriceListener: function(currencyPair, listener){
        if(undefined === this.listenerMap[currencyPair]){
            this.listenerMap[currencyPair] = [];
        }
        this.listenerMap[currencyPair].push(listener);
    }
};


var PricePanel = function(args){
    this.initialize(args);
};

PricePanel.prototype = {
		
	effectDuration : 1000,

	elementsMapping : {
		currencyPair  : "#currencyPair",
		bidPrice      : "#bidPrice",
		askPrice      : "#askPrice",
		bidArrow      : "#bidArrow",
		askArrow      : "#askArrow",
		high          : "#high",
		low           : "#low"
	},	

	initialize: function(args) {
        this.currencyPair = args.currencyPair.replace("/", "");
	},
	
	setPanelElements: function() {
		this.parts = {};
        var map = this.elementsMapping; 
		for(var i in map){
			this.parts[i] = $(map[i] + "_" + this.currencyPair);
		}
    },
	
	onPrice: function(data) {
        if(! this.init){
            this.setPanelElements();
            this.init = true;
        }
		this.priceReflesh(data);
	},
	
	priceReflesh: function(price) {
		this.updateBid(price.bid);
		this.updateAsk(price.ask);
        this.updateHigh(price.bid);
		this.updateLow(price.ask);
        this.currentPrice = price;
	},

	updateBid: function(price) {
		var currentBid = (this.currentPrice) ? this.currentPrice.bid : null;
		this.changeSpotPrice(price, currentBid, 'bid');
	},
	
	updateAsk: function(price) {
		var currentAsk = (this.currentPrice) ? this.currentPrice.ask : null;
		this.changeSpotPrice(price, currentAsk, 'ask');
	},

	changeSpotPrice: function(newPrice, currentPrice, side) {
		this.updatePanel(this.parts[side + 'Price'], newPrice);
        
		// エフェクト処理呼び出し
		if (currentPrice && newPrice != currentPrice) {
			var isDown = (newPrice -0 < currentPrice - 0);
			this.blink(this.parts[side + 'Price'], isDown);
			this.changeArrow(side, isDown);
		}
	},
	
	updateHigh: function(price) {
        var current = this.parts.high.html() - 0;
        if(isNaN(current) || current < price){
            this.updatePanel(this.parts.high, price);   
        }
	},
	
	updateLow: function(price) {
        var current = this.parts.low.html()-0;
        if(isNaN(current) || current > price){
            this.updatePanel(this.parts.low, price);   
        }
	},

    blink: function(ele, isDown) {
		if(! ele) return ;
		
		ele.timerId && clearTimeout(ele.timerId);

		var onComplete = function() {
			ele.removeClass('up').removeClass('down');
			ele.timerId = null;
		};
		isDown 
            ? ele.addClass('down')
            : ele.addClass('up');
		
		ele.timerId = setTimeout(onComplete, this.effectDuration);
	},
	
	changeArrow: function(side, isDown) {
		var ele = this.parts[side + "Arrow"];
		if(! ele) return;
		
		ele.timerId && clearTimeout(ele.timerId);

		var arrow = (isDown) ? "▼" : "▲";
		var onComplete = function() {
            ele.removeClass('up').removeClass('down');
			ele.html("&nbsp;");
			ele.timerId = null;
		};
        isDown 
            ? ele.addClass('down')
			: ele.addClass('up');
		
		ele.html(arrow);
		ele.timerId = setTimeout(onComplete, this.effectDuration);
	},	
	
	updatePanel: function(element, value) {
		element.html(value);
	}

};

