
var DateUtil = {
    
    
    currentDate : function(dateObject){
       var date = dateObject;
        if(date === undefined){
            date = new Date();
        }
        return this.addHour(date, 9);        
    },
    
    currentDateAsString : function(dateObject){
        var dateObj = this.currentDate(dateObject);
        return this.format(dateObj);
    },
    
    format : function(date){
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
    
    addHour : function(dateObj, hour){
        var time = dateObj.getTime();
        time += (1000 * 60 * 60 * hour);
        var result =  new Date();
        result.setTime(time);
        return result;
    },
    
    addSecond : function(dateObj, second){
        var time = dateObj.getTime();
        time += (1000 * second);
        var result =  new Date();
        result.setTime(time);
        return this.format(result); 
    },
    
    minusSecond : function(dateObj, second){
        var time = dateObj.getTime();
        time -= (1000 * second);
        var result =  new Date();
        result.setTime(time);
        return this.format(result); 
    },
    
    getOneMinBaseTime: function(dateObj){
        var minus60 = this.minusSecond(dateObj, 60);
        return minus60.replace(/:\d{2}$/, ":00");
    }
};

exports.DateUtil = DateUtil;
