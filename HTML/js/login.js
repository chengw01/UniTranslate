window.onload = load;

var supportedLang = [];
supportedLang["English (Canada)"] = 'en-CA';
supportedLang["English (UK)"] = 'en-GB';
supportedLang["English (US)"] = 'en-US';
supportedLang["Español"] = "es-MX";
supportedLang["tlhIngan"] = 'tlh';
supportedLang["한국어"] = "ko-KR";
supportedLang["日本語"] = "ja-JP";
supportedLang["普通话 (香港)"] = "cmn-Hans-HK";
supportedLang["普通话 (中国大陆)"] = "cmn-Hans-CN";

function load() {
    //Populate the select box
    var selectBox = document.getElementsByTagName("select")[0];
    for (var lang in supportedLang) {
        var option = new Option(lang,supportedLang[lang]);
        selectBox.appendChild(option);
    }
    
    //Make the "fake button" a button that triggers the form
    var fakeButton = document.getElementsByClassName("fake_button")[0];
    fakeButton.addEventListener("click",function(event){
        if(event.target != fakeButton.getElementsByTagName("input")[0] && document.getElementById("username").value != ""){
            remoteChannelCreate(loginRequestCallback);
        }
    });
    
    //Override default form handling
    var form = document.getElementsByTagName("form")[0];
    form.addEventListener("submit",loginEvent);
    
    translateUI("en-CA");
    
    //UI stuff
    selectBox.addEventListener("change",function(event){
        translateUI(event.target.options[event.target.selectedIndex].value);
    });
}

function loginEvent(event){
    event.preventDefault();
    remoteChannelCreate(loginRequestCallback);
}

function loginRequestCallback(response) {

    if(response != "fail"){
        var select = document.getElementsByTagName("select")[0];
        var session = new SessionManager(response,document.getElementById("username").value,select.options[select.selectedIndex].value);
        window.location = "chat.html"
    }else{
        document.getElementsByClassName("error")[0].className = "error";
    }
    
}

function remoteChannelCreate(callback){
    xhr = new XMLHttpRequest();
    
    var extra = "";
    
    if(document.getElementById("pin").value !== ""){
        extra = "&meeting=" +document.getElementById("pin").value;
    }
    
    var select = document.getElementsByTagName("select")[0];
    xhr.open("GET","session.php?username=" +document.getElementById("username").value +"&lang=" +select.options[select.selectedIndex].value +extra);
    xhr.onload = function(){
       loginRequestCallback(this.responseText); 
    };

    xhr.send("");

}

//Use this function to create a channel until Mike wakes up
function localChannelCreate(callback) {
    callback('test');
}