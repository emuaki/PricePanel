var util = {};
util.extend = function(destination, source, override) {
  for (var property in source) {
    destination[property] = source[property];
  }
  
  for (var property in override) {
    destination[property] = override[property];
  }
  console.log(destination);
  return destination;
};

var BarPublisher = function(socket, option){
    this.initialize(socket, option);
};

BarPublisher.prototype = {
    
    listenerMap : {},

    initialize : function(socket, option) {
		this.socket = socket;
        this.option = option;
        
        var self = this;
        this.socket.on('bar', function (bar) {
            self.onBar(bar);
        });
	},

	onBar: function(bar) {
        var currencyPair = bar.currencyPair;
        var listeners = this.listenerMap[currencyPair];
        for(var j in listeners){
            listeners[j].onBar(bar);
        }
	},
    
    addBarListener: function(currencyPair, listener){
        if(undefined === this.listenerMap[currencyPair]){
            this.listenerMap[currencyPair] = [];
        }
        this.listenerMap[currencyPair].push(listener);
        this.subscribe();
    },
    
    getSubscribeCurrencies : function(){
        var result = [];
        for(var i in this.listenerMap){
            result.push(i);
        }
        return result;
    },
    
    subscribe : function(){
        this.socket.emit('barSubscribe', this.getSubscribeCurrencies());
    },
    
    removeBarListener : function(currencyPair, listener){
        var listeners = this.listenerMap[currencyPair];
        for(var i in listeners){
            if(listeners[i] === listener){
                listeners.splice(i, 1);
                this.unsubscribe();
                break;
            }
        }
                
        if(listeners.length === 0){
            delete this.listenerMap[currencyPair];
        }
    },
    
    unsubscribe : function(){
        this.socket.emit('barUnsubscribe', {});
    }
};


$.jqplot.config.enablePlugins = true;

var BarBasePanel = function(option){
  
};

BarBasePanel.prototype = {
    
    
};

var TickPanel = function(option){
    this.initialize(option);
};

util.extend(TickPanel, BarBasePanel, {

    
    initialDataUrl : "./barData?currencyPair=",
    
    maxDataSize : 50,
    
    gridSize : 5,
    
    isReady : false,
    
    initialized : false,
    
    jqplotOption : {
        axesDefaults: {
            showMark : false,
            fill:true,
            fillToZero: true,
            fontSize: '8pt'
        },
        axes: {
            xaxis: {
                renderer:$.jqplot.DateAxisRenderer,
                tickOptions:{formatString:'%H:%M:%S'},
                pad : 0,
                tickInterval: 40
            },
            yaxis: {
                tickOptions:{formatString:'%.2f'}
            }
        },
        series:[{
            showMarker: false
        }]
    },
    
    initialize : function(option){
        this.currencyPair = option.currencyPair;
        this.elementId = option.elementId;
        this.data = this.getInitialData();
        var self = this;
        setTimeout(function(){
            self.isReady = true;
            self.adjust();
            self.draw();
        }, 500);
    },
    
    getInitialData : function(){
        var ret = null;
        $.ajax({
            async: false,
            url: this.initialDataUrl + this.currencyPair,
            dataType:"json",
            success: function(data) {
                ret = data;
            }
        });
        
        var result = [];
        for (var i in ret){
            result.push([ret[i].timestamp, ret[i].price -0]);
        }
        return [result];
    },
    
    onBar : function(bar){
        if(bar.barType !== 0) return;
        var converted = [bar.timestamp, bar.price - 0];
        this.add(converted);
    },
    
    add : function(bar){
        this.data[0].push(bar);
        this.adjust();
        this.draw();
    },
    
    adjust : function(){
        var diff = this.data[0].length - this.maxDataSize;
        if(diff < 0){
            return;
        }
        for(var i=0; i < diff; i++){
            this.data[0].shift();
        }
    }, 
    
    calcTickInterval: function(){
        if(this.data[0].length <= 1){
            return 0;
        }
        var first = this.data[0][0];
        var length = this.data[0].length;
        var last = this.data[0][length - 1];
        
        var firstDate = new Date(first[0]);
        var lastDate = new Date(last[0]);
        var interval = (lastDate.getTime() - firstDate.getTime()) / 1000;
        var tickInterval = interval / this.gridSize;
        return tickInterval;
    },
    
    setTickInterval : function(interval){
          this.jqplotOption.axes.xaxis.tickInterval = interval;
    },

    draw : function(){
        if(!this.isReady){
            return;
        }
        if(this.data.length <= 0){
            return;
        }
        this.setTickInterval(this.calcTickInterval());
        this.isReady = false;
        if(! this.initialized){
            this.plot = $.jqplot('bar', this.data, this.jqplotOption);
            this.initialized = true;
        }else{
            this.plot.destroy();
            this.plot = $.jqplot('bar', this.data, this.jqplotOption);
        }
        var self = this;
        setTimeout(function(){
            self.isReady = true;
        }, 200);
    }
});
 
