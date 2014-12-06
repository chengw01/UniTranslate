function CommunicationManager(c,u,l,callback,v) {
    this.channel = c;
    this.username = u;
    this.messageSentCallback = callback;
    this.language = l;
    this.hasVideo = true;
    this.rtc;
    
    //TIME HACK
    this.videoElement = v;
    
    cm = this; //Pollution

    this.pubNub = PUBNUB.init({
        publish_key: 'pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e',
        subscribe_key: 'sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe',
        ssl: true
    });


    navigator.getMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );
    
    navigator.getMedia({video: true},
        function(){
            cm.hasVideo = true;
            cm.initRTC();
            
        },
        function(){
            cm.hasVideo = false;
            cm.initRTC();
        }
    );

    
    
   // this.rtc.receive = this.receieveCall;
}

CommunicationManager.prototype.initRTC = function(){
    //YUCK but it looks like the above modifies the array
    this.rtc = PHONE({
        publish_key: 'pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e',
        subscribe_key: 'sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe',
        ssl: true,
        media: {audio: true,video:this.hasVideo},
        number: this.username
    });
    this.rtc.ready(function(){
        console.log("dialing");
        cm.rtc.dial("Wilson");
    })
    
    this.rtc.receive(function(session){
        session.connected(function(session){
            console.log("call got");
            document.getElementById("callbox").appendChild(session.video); 
        });
    });
}

CommunicationManager.prototype.receieveCall = function(session){
    session.connected(function(session){
        console.log("call got");
       PUBNUB.cm.videoElement.appendChild(session.video); 
    });
}

CommunicationManager.prototype.dial = function() {
    console.log("dial");
    var session = cm.rtc.dial('Test2');
}

CommunicationManager.prototype.startNetwork = function () {
    
    console.log("Start channel: " +this.channel);
    
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