function CommunicationManager(c,u,l,callback) {
    this.channel = c;
    this.username = u;
    this.messageSentCallback = callback;
    this.language = l;
    this.pubNub = PUBNUB.init({
        publish_key: 'pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e',
        subscribe_key: 'sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe',
        ssl: true
    });
}

CommunicationManager.prototype.startNetwork = function () {
    
    console.log("Start channel: " +this.channel);

    cm = this;
    this.pubNub.subscribe({
        channel: this.channel,
        message: this.gotMessage
    })
}

CommunicationManager.prototype.gotMessage = function(message){
    cm.messageSentCallback(message);
}

CommunicationManager.prototype.sendToServer = function(event,dataArray) {
    dataArray["event"] = event;
    dataArray["username"] = this.username;
    this.pubNub.publish({
        channel: this.channel,
        message: dataArray
    })
}

CommunicationManager.prototype.sendMessage = function(message){
    var sendArray = {};
    sendArray["time"] = Date.now();
    sendArray["text"] = message;
    sendArray["language"] = this.language;
    
    this.sendToServer("rawmessage",sendArray);
}