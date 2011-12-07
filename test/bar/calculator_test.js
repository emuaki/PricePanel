require.paths.push('lib');
var assert = require('assert');
var calc = require('bar/calculator');
var container = require('bar/container');
var BarType = require('bar/bar').BarType;

var tickContainer = container.createContainer(BarType.TICK);
var calculator = calc.createCalculator(BarType.ONE_MIN, tickContainer);


module.exports = {
    "test doCalc" : function() {
        calculator.doCalc();
    }
};

require("asyncjs").test.testcase(module.exports).exec();
