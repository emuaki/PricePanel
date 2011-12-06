require.paths.push('lib');
var assert = require('assert');
var OneMin = require('bar/bar').OneMin;

var oneMin = new OneMin({
    currencyPair : "USD/JPY"
});
assert.equal(oneMin.toString(), "currencyPair: USD/JPY, ");
