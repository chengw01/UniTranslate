window.onload = load;

var supportedLang = [];
supportedLang["English"] = 'en-CA';
supportedLang["Pig Latin"] = 'en-CA';

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
        
        localChannelCreate(loginRequestCallback);
    });
}

function loginRequestCallback(response) {
    var select = document.getElementsByTagName("select")[0];
    var session = new SessionManager(response,document.getElementById("username").value,select.options[select.selectedIndex].value);
    window.location = "chat.html"
}

//Use this function to create a channel until Mike wakes up
function localChannelCreate(callback) {

    var pubNub = PUBNUB.init({
        publish_key: 'pub-c-59a1f5c0-e4a6-48ce-b148-b9b0ca01bb3e',
        subscribe_key: 'sub-c-81c3a310-7d53-11e4-9173-02ee2ddab7fe'
    });
    
    pubNub.subscribe({
        channel: 'test',
        message: function(t){
            console.log(t);   
        }
    })
    
    pubNub.publish({
        channel: 'test',
        message: {
            "test": "test",
            "test2": "test2"
        }
    })
    
    callback('test');
}