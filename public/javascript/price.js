var PricePublisher = function(option){
    this.initialize(option);
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
    
    addPriceListener(currencyPair, listener){
        if(undefined == this.listenerMap[currencyPair]){
            this.listenerMap[currencyPair] = [];
        }
        this.listenerMap[currencyPair].push(listener);
    }
};


var PricePanel = function(args){
    this.initialize(args);
};

PricePanel.prototype = {
		
	/** パネル更新エフェクトの間隔 */
	effectDuration : 1000,

	elementsMapping : {
		currencyPair  : "#currencyPair",
		bidPrice      : "#reference-rate-bid .price",
		askPrice      : "#reference-rate-ask .price",
		bidArrow      : "#bid-arrow",
		askArrow      : "#ask-arrow",
		high          : "#high",
		low           : "#low",
	},	

	initialize: function(args) {
		this.setPanelElements();
	},
	

	setPanelElements: function() {
		this.parts = {};
    	var map = this.elementsMapping; 
		for(i in map){
			this.parts[i] = $(map[i] + this.panelIndex);
		}
    },
	
	onPrice: function(data) {
		var self = this;
		self.priceReflesh(data);
	},
	
	priceReflesh: function(price) {
		this.updateBid(price.bid);
		this.updateAsk(price.ask);
        this.setHigh(price.bid);
		this.setLow(price.ask);
        this.currentPrice = price;
	},

	updateBid: function(price, withEffect) {
		var currentPrice = (this.currentPrice) ? this.currentPrice.bid : null;
		this.changeSpotPrice(price, currentAsk, 'bid');
	},
	
	updateAsk: function(price, withEffect) {
		var currentAsk = (this.currentPrice) ? this.currentPrice.ask : null;
		this.changeSpotPrice(price, currentAsk, 'ask');
	},

	changeSpotPrice: function(newPrice, currentPrice, side, withEffect) {
	
		this.updatePanel(this.parts[side + 'Price'], newPrice);
	
		// エフェクト処理呼び出し
		if (withEffect && currentPrice && newPrice != currentPrice) {
			// Numberで比較するために0を引いている
			var isDown = (newPrice -0 < currentPrice - 0);
			this.blink(this.parts[side + 'Price'], isDown);
			this.changeArrow(side, isDown);
		}
	},
	
	updateHigh: function(high, isSuspend) {

	},
	
	updateLow: function(low, isSuspend) {
		if (! this.parts['low'])return;
		
		if (!this.currentPriceData || (this.currentPriceData && this.currentPriceData.low != low)) {
			var isChange = (!isSuspend && this.currentPriceData && this.currentPriceData.low && low);
			var dispValue = low ? low : '－';
			if (dispValue == '－') {
				this.parts['low'].css('text-align', 'center');
			} else {
				this.parts['low'].css('text-align', 'right');
			}
			this.updatePanel(this.parts['low'], Util.addComma(dispValue));
			if (isChange) {
				this.blink(this.parts['low'], (this.currentPriceData.low - 0 > low - 0));
			}
		}
	},

    blink: function(ele, isDown) {
		if(! ele) return ;
		
		ele.timerId && clearTimeout(ele.timerId);

		var onComplete = function() {
			ele.removeClass('up').removeClass('down');
			ele.timerId = null;
		}
		if (isDown) {
			ele.addClass('down');
		} else {
			ele.addClass('up');
		}
		ele.timerId = setTimeout(onComplete, this.setting.effectDuration);
	},
	
	changeArrow: function(side, isDown) {
		var ele = this.parts[side + "Arrow"];
		if(! ele) return;
		
		ele.timerId && clearTimeout(ele.timerId);

		var arrow = (isDown) ? "▼" : "▲";
		var onComplete = function() {
			ele.html("&nbsp;")
			ele.timerId = null;
		}
		ele.html(arrow);
		ele.timerId = setTimeout(onComplete, this.setting.effectDuration);
	},	
	
	updatePanel: function(element, value) {
		if (!element) return false;
		$(element).html(value);
	}

};

