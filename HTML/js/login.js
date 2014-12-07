window.onload = load;

var supportedLang = [];
supportedLang["English"] = 'en-CA';
supportedLang["Pig Latin"] = 'en-CA';
supportedLang["普通话 (香港)"] = "cmn-Hans-HK";

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
       if(event.target != fakeButton.getElementsByTagName("input")[0]){
            document.getElementsByTagName("form")[0].submit();
       }
    });
    
    //Override default form handling
    var form = document.getElementsByTagName("form")[0];
    form.addEventListener("submit",function(event){
        event.preventDefault();
        
        remoteChannelCreate(loginRequestCallback);
    });
}

function loginRequestCallback(response) {
    
    console.log("Response: " +response +"werwe");
    
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
    
    if(document.getElementById("pin").value != ""){
        extra = "&meeting=" +document.getElementById("pin").value;
    }
    
    xhr.open("GET","session.php?username=" +document.getElementById("username").value +extra);
    xhr.onload = function(){
       loginRequestCallback(this.responseText); 
    };
    //Send
    xhr.send("");

}

//Use this function to create a channel until Mike wakes up
function localChannelCreate(callback) {
    callback('test');
}