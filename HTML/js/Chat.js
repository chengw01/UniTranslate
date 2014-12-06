window.onresize = resize;
window.onload = load;

var speech;
var sManager;
var progressTick;
var seconds;

function load() {
    resize();
    sManager = new SessionManager();
    speech = new InputHandler(sManager.language,speechEvent);
}

function speechEvent(args) {
    console.log(args);
    
    //This really bugs me
    args["text"] = args["text"].charAt(0).toUpperCase() + args["text"].slice(1);
    
    var input = document.getElementsByTagName("input")[0];
    input.value = args["text"];
    var confidence = Math.round(255 * args["confidence"]);
    input.setAttribute("style","color: rgb(" +(255-confidence) +"," +confidence +",60);" );

    //Prepare to send the message!
    seconds = Math.min(Math.round((1 - args["confidence"]) * 10000),3000);
    progressTick = setInterval(progressUpdate,100);
    window.setTimeout(sendMessage, seconds+ 100); //So the animation can finish :P
}

function progressUpdate() {
    var progress = document.getElementsByTagName("progress")[0];
    var interval = seconds/100;
    
    progress.value = progress.value + 100/interval;
}

function sendMessage() {
    clearInterval(progressTick);
}

//Because CSS sucks
function resize() {
    var chatBox = document.getElementsByClassName("chatbox")[0];
    chatBox.setAttribute("style","height:" +window.innerHeight/10*9 +"px;");
}
