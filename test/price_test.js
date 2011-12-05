require.paths.push('lib');
var price = require('price');
var assert = require('assert');

var target = price.create({
    currencyPair : "USD/JPY"
});

assert.ok(price);
console.log("test execute");

assert.equal(target.currencyPair, "USD/JPY");