window.onresize = resize;
window.onload = load;

var speech;
var sManager;
var comm;
var progressTick;
var seconds;
var chatLog;

function load() {
    resize();
    
    //Start our various objects
    sManager = new SessionManager();
    speech = new InputHandler(sManager.language,speechEvent);
    comm = new CommunicationManager(sManager.channel,sManager.username,sManager.language,gotMessageCallback);
    chatLog = new ChatHistory();
    
    //Start the communication!
    comm.startNetwork();
}

function gotMessageCallback(message){

    //If we both speak the same language, we don't need to wait for a translation
    if(message["language"] == sManager.language){
        chatLog.addMessageToHistory(message["username"],message["text"],"");
    }
}

//This callback is triggered when we get speech events
//Updates the UI and prepare to send message to server
function speechEvent(args) {
    console.log(args);
    
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
    window.setTimeout(sendMessage, seconds+ 100); //So the animation can finish :P
}

//Simple timer event to update the progress bar
function progressUpdate() {
    var progress = document.getElementsByTagName("progress")[0];
    var interval = seconds/100;
    
    progress.value = progress.value + 100/interval;
}

function sendMessage() {
    clearInterval(progressTick);
    var textElement = document.getElementById("send");
    comm.sendMessage(textElement.value);
    
    //Reset things
    textElement.value = "";
    document.getElementsByTagName("progress")[0].value = 0;
}

//Because CSS sucks
function resize() {
    var chatBox = document.getElementsByClassName("chatbox")[0];
    chatBox.setAttribute("style","height:" +window.innerHeight/10*9 +"px;");
}
