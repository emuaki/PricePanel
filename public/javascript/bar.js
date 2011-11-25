
$.jqplot.config.enablePlugins = true;

var TickPanel = function(option){
    this.initialize(option);
};

TickPanel.prototype = {
    
    initialDataUrl : "./barData?currencyPair=",
    
    jqplotOption : {
        axesDefaults: {
            showMark : false,
            fill:true,
            fillToZero: true
        },
        axes: {
            xaxis: {
                renderer:$.jqplot.DateAxisRenderer,
                tickOptions:{formatString:'%M:%S'}
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
        return [ret];
    },
    
    add : function(){
        
    },
    
    adjust : function(){
        
    },
    
    draw : function(){
        $.jqplot('bar', this.data, this.jqplotOption);
    }
};
 
