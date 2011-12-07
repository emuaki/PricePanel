require.paths.push('lib');
var assert = require('assert');
var OneMin = require('bar/bar').OneMin;

var oneMin = new OneMin({
    currencyPair : "USD/JPY"
});

module.exports = {
    "test toString" : function() {
        assert.equal(oneMin.toString(), "currencyPair: USD/JPY, ");
    }
};

require("asyncjs").test.testcase(module.exports).exec();
