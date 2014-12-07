var translated = {};
var loadedCallback;

function translateUI(lang,callback){
    xhr = new XMLHttpRequest();

    xhr.open("GET","Strings/" +lang +".json");
    
    xhr.onload = doTranslate;
    
    xhr.send("");
    loadedCallback = callback;
}

function doTranslate(){

    if(this.status == 200){
        var data = JSON.parse(this.responseText);
        
        translated = data;
        
        for(var item in data){

            var element = document.querySelectorAll("[data-string=\"" +item +"\"]")[0];
            if(element){
                var tag = element.tagName;
                if (tag == "INPUT") {
                    element.setAttribute("placeholder",data[item]);
                }else{
                    element.textContent = data[item];    
                }
                
            }
            
        }
        
        if(loadedCallback){
            loadedCallback(true);
        }
        
    }else{
        translateUI("en-CA",loadedCallback);
    }
    
}

function getTranslationForDefine(define){
    console.log(translated);
    if(translated[define]){
        return translated[define];
    }
    return "This is not yet defined!";
}