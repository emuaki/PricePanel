require.paths.push('lib');
var assert = require('assert');
var DateUtil = require('date').DateUtil;

module.exports = {
    "test currentDateAsString" : function() {
        assert.equal(DateUtil.currentDateAsString(), "20111111");
    }
};

require("asyncjs").test.testcase(module.exports).exec();
