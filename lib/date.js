
var DateUtil = {
    
    currentDateAsString : function(dateObject){
        var date = dateObject;
        if(date === undefined){
            date = this.plus9hour(new Date());
        }
        var yy = date.getYear();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var hh = date.getHours();
        var min = date.getMinutes();
        var ss = date.getSeconds();

        if (yy < 2000) { yy += 1900; }
        if (mm < 10) { mm = "0" + mm; }
        if (dd < 10) { dd = "0" + dd; }
        if (hh < 10) { hh = "0" + hh; }
        if (min < 10) { min = "0" + min; }
        if (ss < 10) { ss = "0" + ss; }

        var dateString = yy + "/" + mm + "/" + dd + " " + hh + ":" + min + ":" + ss;
        return dateString;
    },
    
    plus9hour : function(dateObj){
        var time = dateObj.getTime();
        time += (1000 * 60 * 60 * 9);
        var result =  new Date()
        result.setTime(time);
        return result;
    }
};

exports.DateUtil = DateUtil;
