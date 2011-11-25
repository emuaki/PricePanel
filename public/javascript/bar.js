$.jqplot.config.enablePlugins = true;

function createBar(currencyPair){

    var ajaxDataRenderer = function(url, plot, options) {
        var ret = null;
        $.ajax({
            async: false,
            url: url,
            dataType:"json",
            success: function(data) {
                ret = data;
            }
        });
        return [ret];
    };

    plot1 = $.jqplot('bar', "./barData?currencyPair=" + currencyPair,{
      dataRenderer: ajaxDataRenderer,
      axes: {
          xaxis: {
              renderer:$.jqplot.DateAxisRenderer,
              tickOptions:{formatString:'%M:%S'}
          },
          yaxis: {
              tickOptions:{formatString:'%.2f'}
          }
      }
    });

}
