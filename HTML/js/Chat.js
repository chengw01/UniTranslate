window.onresize = resize;
window.onload = load;

var speech;
var sManager;

function load() {
    resize();
    sManager = new SessionManager();
    console.log("LANG: " +sManager.language);
    speech = new InputHandler(sManager.language,speechEvent);
}

function speechEvent(args) {
    //code
}

//Because CSS sucks
function resize() {
    var chatBox = document.getElementsByClassName("chatbox")[0];
    chatBox.setAttribute("style","height:" +window.innerHeight/10*9 +"px;");
}
