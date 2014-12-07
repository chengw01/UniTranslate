window.onresize = resize;
window.onload = load;

var speech;
var sManager;
var comm;
var progressTick;
var sendMessageDelay;
var seconds = 0;
var chatLog;
var speech;

function load() {
    resize();
    
    //Hook an enter listener to the input element
    var input = document.getElementsByTagName("input")[0];

    input.addEventListener("keypress",function(event){
        if(event.charCode === 13 && document.getElementById("send").value != ""){
            sendMessage();
        }
        
        //User is overriding auto gen text
        if(seconds !== 0){
            clearInterval(progressTick);
            clearTimeout(sendMessageDelay);
        }
    });
    
    //Start our various objects
    sManager = new SessionManager();
    speech = new InputHandler(sManager.language,speechEvent);
    comm = new CommunicationManager(sManager.channel,sManager.username,sManager.language,gotMessageCallback);
    chatLog = new ChatHistory();
    speech = new SpeechEngine(sManager.language);
    
    //Start the communication!
    comm.startNetwork();
    
    chatLog.addSystemMessage("Welcome to room " +sManager.channel);
}

function gotMessageCallback(message){
    console.log(message);
    if(message == "connected"){
        var data = {};
        data["username"] = sManager.username;
        data["language"] = sManager.language;
        comm.sendToServer("newuser",data);
    }else if(message["event"] == "newuser" && message["username"] != sManager.username){
        //DIAL THE USER!!
        console.log("dialing");
        comm.dial(message["username"]);
        
        chatLog.addSystemMessage(message["username"] +" has connected");
    }else if(message["event"] == "message"){
        
        //If the message is a string, that means no translation was needed
        if(typeof message["message"] === "string"){
            chatLog.addMessageToHistory(message["username"],message["message"],"");
        }else{
            
            //This is our language, no translation needed
            if(message["language"] == sManager.language){
                chatLog.addMessageToHistory(message["username"],message["message"][sManager.language],"");
            }else{
                for(var l in message["message"]){
                    if(l == sManager.language){
                        chatLog.addMessageToHistory(message["username"],message["message"][sManager.language],message["message"][message["language"]]);
                        speech.speak(message["message"][sManager.language]);
                        break;    
                    }
                    
                }
            }
        }
    }
    
}

//This callback is triggered when we get speech events
//Updates the UI and prepare to send message to server
function speechEvent(args) {
    
    //This really bugs me
    args["text"] = args["text"].charAt(0).toUpperCase() + args["text"].slice(1);
    
    var input = document.getElementsByTagName("input")[0];
    input.value = args["text"];
    var confidence = Math.round(255 * args["confidence"]);
    input.setAttribute("style","color: rgb(" +(255-confidence) +"," +confidence +",60);" );

    //Prepare to send the message!
    //We give users some time to correct or abort the send if something is wayy off
    seconds = Math.min(Math.round((1 - args["confidence"]) * 10000),3000);
    progressTick = setInterval(progressUpdate,100);
    sendMessageDelay = window.setTimeout(sendMessage, seconds+ 100); //So the animation can finish :P
}

//Simple timer event to update the progress bar
function progressUpdate() {
    var progress = document.getElementsByTagName("progress")[0];
    var interval = seconds/100;
    
    console.log(progress.value + 100/interval);
    progress.value = progress.value + 100/interval;
}

function sendMessage() {
    clearInterval(progressTick);
    seconds = 0;
    var textElement = document.getElementById("send");
    comm.sendTranslateRequest(textElement.value);
    
    //Reset things
    textElement.value = "";
    document.getElementsByTagName("progress")[0].value = 0;
}

//Because CSS sucks
function resize() {
    var chatBox = document.getElementsByClassName("chatbox")[0];
    var subtract = 0;
    if(document.getElementsByTagName("video").length > 0){
        subtract = 400;
    }
    chatBox.setAttribute("style","height:" +(window.innerHeight-subtract)/10*9 +"px;");
}
