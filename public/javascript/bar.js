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
        if(listeners === undefined) return;
        
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
    
    panels : {},
    
    text : {
        TICK : "Tick",
        ONE_MIN: "1分足"
    },
    
    initialize : function(option){
        this.container = $(option.containerId);
        this.tickButton = this.container.find(option.tickButtonId);
        this.oneMinButton = this.container.find(option.oneMinButtonId);
        this.currencyPair = option.currencyPair;
        this.barPublisher = option.barPublisher;
        this.create();
    },
    
    create : function(){
        this.createBarPanel();
        this.setupListener();
        this.currentPanel.isShow = true;
        this.currentPanel.draw();
    },
    
    createBarPanel : function(){
        var option = {
            elementId : "bar",
            currencyPair : this.currencyPair
        };
        var tick = BarType.TICK;
        this.panels[tick] = new TickPanel(option);
        barPublisher.addBarListener(this.currencyPair, this.panels[tick]);

        var oneMin = BarType.ONE_MIN;
        this.panels[oneMin] = new OneMinPanel(option);
        barPublisher.addBarListener(this.currencyPair, this.panels[oneMin]);
    
        this.currentPanel = this.panels[0];
    },
    
    setupListener : function(){
        var self = this;
        this.tickButton.click(function(){
            self.onChange(BarType.TICK);
        });
        
        this.oneMinButton.click(function(){
            self.onChange(BarType.ONE_MIN);
        });
    },
    
    onChange : function(barType){
        this.currentPanel.hide();
        this.panels[barType].show();
        this.panels[barType].draw();
        this.currentPanel = this.panels[barType];
    },
    
    removeBarListener : function(){
        for(var i in this.panels){
            this.barPublisher.removeBarListener(this.currencyPair, this.panels[i]);
        }
    }
    
};

$.jqplot.config.enablePlugins = true;

var BarBasePanel = function(){};

BarBasePanel.prototype = {
    
    initialDataUrl : "./barData",
    
    maxDataSize : 50,
    
    gridSize : 5,
    
    isReady : false,
    
    isDataLoaded : false,
    
    isShow : false,
    
    initialize : function(option){
        this.currencyPair = option.currencyPair;
        this.elementId = option.elementId;
    },
    
    getInitialData : function(){
        this.data = this.doGetInitialData();
        this.adjust();
        this.isDataLoaded= true;
        this.isReady = true;
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
    
    doGetInitialData : function(){
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
        if(!this.isShow) return;
        this.draw();
    },
    
    adjust : function(){
        var diff = this.data[0].length - this.maxDataSize;
        if(diff <= 0){
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
    
    show : function(){
        this.isShow = true;
        this.draw();
    },
    
    hide : function(){
        this.isShow = false;
        if(this.plot === undefined) return;
        this.plot.destroy();        
    },
    
    isDraw : function(){
        if(!this.isReady){
            return false;
        }
        if(this.data[0].length <= 0){
            return false;
        }
        return true;
    },
    
    draw : function(){
        if(!this.isDataLoaded){
            this.getInitialData();   
        }
        if(!this.isDraw()){
            return;
        }
        
        console.log(this.data);

        this.setTickInterval(this.calcTickInterval());
        this.isReady = false;
        if(this.plot !== undefined) this.plot.destroy();
        this.plot = $.jqplot(this.elementId, this.data, this.jqplotOption);
     
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
            bar.closePrice - 0
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
