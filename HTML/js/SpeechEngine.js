function SpeechEngine(lang) {
    if (window.SpeechSynthesisUtterance){
        this.engine = new SpeechSynthesisUtterance();

        //If the language is English, do not pass a lang parameter,
        //Google voice will be used instead
        if(lang.substring(0,2) != "en"){
            this.engine.lang = lang;
        }
    
        this.speaking = false;
        this.queue = [];
    
        var speak = this;
        this.engine.onend = function(e){
            speak.speaking = false;
            if(speak.queue.length > 0){
                speak.speak(speak.queue.pop());
            }
        };
    }else{
        this.disabled = true;    
    }
}

SpeechEngine.prototype.speak = function(message){
    if(!this.disabled){
       if(!this.speaking){
            this.engine.text = message;
            this.speaking = true;
            window.speechSynthesis.speak(this.engine);  
        }else{
            this.queue.push(message);
        }  
    }
}