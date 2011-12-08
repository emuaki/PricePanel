
var Config = function(app, io){
    this.app = app;
    this.io = io;
};

Config.prototype.configure = function(){

    var self = this;
    self.hostname = "http://pricepanel.dev.cloud9ide.com/";
    this.app.configure('production', function() {
        self.hostname = "http://floating-earth-4631.herokuapp.com/";
    });
    
    this.io.configure('production', function(){
        self.io.enable('browser client minification');
        self.io.enable('browser client gzip');
        self.io.set('transports', [
            'htmlfile',
            'xhr-polling',
            'jsonp-polling'
        ]);
        self.io.set( "log level", 1 );
    });

};

exports.create = function(){
    return new Config(arguments[0], arguments[1]);
};

