var TwitterService = function(args){
    this.initialize(args);
};

TwitterService.prototype = {
    
    initialize : function(args){
        console.log("twitter service initialize");
        var TwitterNode = require('twitter-node').TwitterNode;
        var twitter = new TwitterNode({
            user: 'devemuakicom',
            password: 'dev@emuaki.com',
            track: ['fx','USD/JPY']
        });

        twitter.addListener('tweet', function(tweet) {
            console.log(tweet.text);
        }).stream();

    },
    
    start : function(){
        
    }

};

var twitterService = new TwitterService();
exports.getService = function(){
    return twitterService;   
};
