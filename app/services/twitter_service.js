var TwitterService = function(args){
    this.initialize(args);
};

TwitterService.prototype = {
    
    initialize : function(args){
        console.log("twitter service initialize");
        return;
        
        var Twitter = require('ntwitter');
        var twit = new Twitter({
            consumer_key: 'FOqTAayAfyMgKdYwQ3EwhA',
            consumer_secret: 'bMkQSr0bd1xTzZfr2U4MnKEiradp5P3iLDSJInxo',
            access_token_key: '463759440-L7wfycq1ea0oSj6pd2qZExcKMXw6MhsDo3G8UFa7',
            access_token_secret: 'OvxQtfQwZ3vvObf5UkAS56jBhsDQX6EfxMUxZ8uTE'
        });
        
        twit.stream('statuses/filter', {track: "fx,usd/jpy,eur/jpy,aud/jpy"}, function(stream) {
            stream.on('data', function (data) {
                
                var tweet = {
                    name : data.user.screen_name,
                    text : data.text,
                    created_at : data.created_at
                };
                console.log(tweet);
            });
        });
    },
    
    start : function(){
        
    }

};

var twitterService = new TwitterService();
exports.getService = function(){
    return twitterService;   
};
