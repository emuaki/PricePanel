var SessionStore = function(option){
    this.sessions = {};
    this.initialize(option);
};

SessionStore.prototype = {
    
    initialize : function(args){
        this.id = args.socket.id;
    },

    add : function(key, session){
        this.sessions[key] = session;
    }, 
    
    get : function(key){
        return this.sessions[key];   
    }
};


var SessionManager = function(option){
    this.initialize(option);
};

SessionManager.prototype = {
    
    sessions : {},
    
    initialize : function(option){
        this.io = option.io;
        this.pricePublisher = option.pricePublisher;
        this.barPublisher = option.barPublisher;
        this.connectionCount = 0;
    },
    
    start : function(){
        var self = this;
        self.io.sockets.on('connection', function (socket) {
            self.addSession(self.createSessionStore(socket));
            socket.on('disconnect', function(){
                self.removeSession(socket.id);
            });
        });
        
    },
    
    createSessionStore : function(socket){
        var sessionStore = new SessionStore({socket: socket});
        sessionStore.add("PriceSession", require('sessions/price_session').create({socket: socket, sessionManager : this}));
        sessionStore.add("BarSession", require('sessions/bar_session').create({socket: socket, sessionManager : this}));
        sessionStore.add("StatusSession", require('sessions/status_session').create({socket: socket}));
        sessionStore.add("ChatSession", require('sessions/chat_session').create({socket: socket}));       
        return sessionStore;
    },
    
    addSession : function(sessionStore){
        this.sessions[sessionStore.id] = sessionStore;
    },
    
    removeSession : function(id){
        delete this.sessions[id];
    }

};

exports.create = function(){
    return new SessionManager(arguments[0], arguments[1]);   
};



