var util = {};
util.extend = function(destination, source, override) {
    
    function copy(dest, origin){
        for (var property in origin) {
            dest.prototype[property] = origin[property];
        }
    }
    copy(destination, source.prototype);
    copy(destination, override);
  
    return destination;
};

var BarType = {
    TICK : 0,
    ONE_MIN : 1
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


var BarTypeChanger = function(option){
    this.initialize(option);
};

BarTypeChanger.prototype = {
    
    text : {
        TICK : "Tick",
        ONE_MIN: "1分足"
    },
    
    initialize : function(option){
        this.elementId = option.elementId;
    },
    
    create : function(){
        this.setupListener();
    },
    
    setupListener : function(){
        
    },
    
    onChange : function(){
        
    },
    
    doChange : function(){
        
    }
    
};

$.jqplot.config.enablePlugins = true;

var BarBasePanel = function(){};

BarBasePanel.prototype = {
    
    initialDataUrl : "./barData",
    
    maxDataSize : 50,
    
    gridSize : 5,
    
    isReady : false,
    
    initialized : false,
    
    initialize : function(option){
        this.currencyPair = option.currencyPair;
        this.elementId = option.elementId;
        this.data = this.getInitialData();
        var self = this;
        setTimeout(function(){
            self.isReady = true;
            self.adjust();
            self.draw();
        }, 100);
    },
    
    getInitialDataUrl : function(){
        var url = [
            this.initialDataUrl,
            "?currencyPair=",
            this.currencyPair,
            "&barType=",
            this.barType
        ].join("");
        return url;
    },
    
    getInitialData : function(){
        var ret = null;
        $.ajax({
            async: false,
            url: this.getInitialDataUrl(),
            dataType:"json",
            success: function(data) {
                ret = data;
            }
        });
        
        var result = [];
        for (var i in ret){
            result.push(this.convert(ret[i]));
        }
        return [result];
    },
    
    onBar : function(bar){
        if(! this.isTargetBarType(bar)) return;
        var converted = this.convert(bar);
        this.add(converted);
    },
    
    isTargetBarType : function(bar){
        if(bar.barType === this.barType){
            return true;
        }
        return false;
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
        console.log(this.data);
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
    },
    
    convert : function(bar){
        var converted = [
            bar.timestamp, 
            bar.openPrice - 0, 
            bar.highPrice - 0, 
            bar.lowPrice - 0,
            bar.closePrice -0
        ];
        return converted;
    }
    
};

var TickPanel = function(option){
    this.data = {};
    this.initialize(option);
};

util.extend(TickPanel, BarBasePanel, {
    
    barType : BarType.TICK,
    
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
    
    convert : function(bar){
        var converted = [bar.timestamp, bar.price - 0];
        return converted;
    }

});
 
var OneMinPanel = function(option){
    this.data = {};
    this.initialize(option);
};

util.extend(OneMinPanel, BarBasePanel, {
    
    barType : BarType.ONE_MIN,
    
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
            renderer:$.jqplot.OHLCRenderer, 
            rendererOptions:{ candleStick:true }            
        }]
    }

});
