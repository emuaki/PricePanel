require.paths.push('lib');
var assert = require('assert');
var DateUtil = require('date').DateUtil;

module.exports = {
    
    "test plus9hour" : function(){
        var date = new Date(2011, 12, 7, 15, 54, 30);
        assert.equal(date.toString(), "Sat Jan 07 2012 15:54:30 GMT+0000 (GMT)");
        
        var plus9hour = DateUtil.plus9hour(date);
        assert.equal(plus9hour.toString(), "Sun Jan 08 2012 00:54:30 GMT+0000 (GMT)");
    },
    
    
    "test currentDateAsString" : function() {
        assert.equal(DateUtil.currentDateAsString(), "20111111");
    }
};

require("asyncjs").test.testcase(module.exports).exec();
