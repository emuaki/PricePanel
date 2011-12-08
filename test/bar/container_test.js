require.paths.push('lib');
var assert = require('assert');
var container = require('bar/container');
var BarType = require('bar/bar').BarType;
var bar = require('bar/bar');

var tickContainer = container.createContainer(BarType.TICK);
var oneMinContainer = container.createContainer(BarType.ONE_MIN);

module.exports = {
    "test put" : function() {
        var tick = new bar.Tick({
            currencyPair : "USD/JPY",
            price : 100,
            timestamp : "test"
        });
        
        tickContainer.put(tick);
        console.log(tickContainer.queue);
        console.log(oneMinContainer.queue);
    }
};

require("asyncjs").test.testcase(module.exports).exec();
