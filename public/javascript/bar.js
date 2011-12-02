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
    },
    
    removeBarListener : function(currencyPair, listener){
        var listeners = this.listenerMap[currencyPair];
        for(var i in listeners){
            if(listeners[i] === listener){
                delete listeners[i];
                break;
            }
        }
    }
};



$.jqplot.config.enablePlugins = true;

var TickPanel = function(option){
    this.initialize(option);
};

TickPanel.prototype = {
    
    initialDataUrl : "./barData?currencyPair=",
    
    maxDataSize : 50,
    
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
        var first = this.data[0][0];
        var length = this.data[0].length;
        var last = this.data[0][length];
        
        var firstDate = new Date(first.timestamp);
        var lastDate = new Date(last.timestamp);
        
        console.log(firstDate);
        console.log(lastDate);
    },

    draw : function(){
        if(!this.isReady){
            return;
        }
        if(this.data.length <= 0){
            return;
        }
        this.calcTickInterval();
        console.log(this.data[0].length);
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
        }, 2000);
    }
};
 
