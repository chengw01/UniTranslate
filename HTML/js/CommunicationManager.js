function CommunicationManager(c,u,l,callback,v) {
    this.channel = c;
    this.username = u;
    this.messageSentCallback = callback;
    this.language = l;
    this.hasVideo = true;
    this.rtc;
    this.videoCallSession = [];
    this.ready = false;
    
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
            
        },
        function(){
            cm.hasVideo = false;
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
        if(this.hasVideo){
            document.getElementById("callbox").appendChild(phone.video);
        }
        cm.ready = true;
        cm.messageSentCallback("connected");
    })
    
    this.rtc.receive(function(session){
        session.connected(function(session){
            var videoSession = session.video;
            var number = session.number;
            videoSession.setAttribute("id","video-" +number);
            document.getElementById("callbox").appendChild(videoSession);
            cm.videoCallSession[number] = session;
            videoSession.volume = 0.2;
            resize();  
        });
    });
}

CommunicationManager.prototype.dial = function(number){
    this.rtc.dial(number);
}

CommunicationManager.prototype.startNetwork = function () {

    this.pubNub.subscribe({
        channel: this.channel,
        message: this.gotMessage,
        connect: this.pubNubConnected,
        presence: this.connectEvent,
        heartbeat: 10,
        state: {
            username: this.username
        }
        
    })
}

CommunicationManager.prototype.connectEvent = function(event){
    if(event["action"] == "timeout"){
        var username = event["data"]["username"];
        var session = cm.videoCallSession[username];
        var element = document.getElementById("video-" +username);
        if(element){
            session.hangup();
            document.getElementsByClassName("callbox")[0].removeChild(element);
            delete cm.videoCallSession[username];
            resize();
        }
        var returnArray = {};
        returnArray["event"] = "disconnect";
        returnArray["username"] = username;
        cm.messageSentCallback(returnArray);
    }
}

CommunicationManager.prototype.pubNubConnected = function (){
    cm.initRTC();
}

CommunicationManager.prototype.gotMessage = function(message){
    cm.messageSentCallback(message);
}

CommunicationManager.prototype.sendTranslateRequest = function(message,retry) {
    xhr = new XMLHttpRequest();

    xhr.open("GET","translate.php?room=" +this.channel +"&username=" +this.username +"&message=" +message);
    xhr.send("");
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