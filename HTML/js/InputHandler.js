function InputHandler(language,c) {
    this.callback = c;
    this.recongizer = new webkitSpeechRecognition();
    
    //Prep the recognizer
    this.recongizer.lang = language;
    that = this;
    this.recongizer.onresult = InputHandler.handleResult;
    this.recongizer.onend = InputHandler.recognizerComplete;
    this.recongizer.start();

}

InputHandler.recognizerComplete = function () {
    that.recongizer.start();
}

InputHandler.handleResult = function(event) {
    //Loop through all the results comparing confidence
    var confidence = 0;
    var confidenceIndex = 0;
    for(var i = 0;i<event.results[0].length;i++){
        if(event.results[0][i]["confidence"] > confidence){
            confidence = event.results[0][i]["confidence"];
            confidenceIndex = i;
        }
    }
    
    that.callback({
        "text" : event.results[0][confidenceIndex].transcript,
        "confidence" : confidence
        
    });
}