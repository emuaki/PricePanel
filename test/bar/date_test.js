require.paths.push('lib');
var assert = require('assert');
var DateUtil = require('date').DateUtil;

module.exports = {
    
    "test addHour" : function(){
        var date = new Date(2011, 11, 7, 15, 54, 30);
        assert.equal(date.toString(), "Wed Dec 07 2011 15:54:30 GMT+0000 (GMT)");
        
        var plus1hour = DateUtil.addHour(date, 1);
        assert.equal(plus1hour.toString(), "Wed Dec 07 2011 16:54:30 GMT+0000 (GMT)");

        var plus9hour = DateUtil.addHour(date, 9);
        assert.equal(plus9hour.toString(), "Thu Dec 08 2011 00:54:30 GMT+0000 (GMT)");
        
    },
    
    "test addSecond" : function(){
        var date = new Date(2011, 11, 7, 15, 54, 0);
        var plus59second = DateUtil.addSecond(date, 59);
        assert.equal(plus59second.toString(), "Wed Dec 07 2011 15:54:59 GMT+0000 (GMT)");
    },
    
    "test format" : function(){
        var date = new Date(2011, 11, 7, 15, 54, 30);
        assert.equal(DateUtil.format(date), "2011/12/07 15:54:30");
    },
    
    "test currentDateAsString" : function() {
        var date = new Date(2011, 12, 7, 15, 54, 30);
        assert.equal(DateUtil.currentDateAsString(date), "2012/01/08 00:54:30");
    },
    
    "test getOneMinBaseTime" : function(){
        var dateObj = new Date(2011, 11, 7, 15, 54, 30); 
        assert.equal(DateUtil.getOneMinBaseTime(dateObj), "2011/12/07 15:54:00"); 
    }
};

require("asyncjs").test.testcase(module.exports).exec();
