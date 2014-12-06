function InputHandler(language,c) {
    this.callback = c;
    this.recongizer = new webkitSpeechRecognition();
    
    //Prep the recognizer
    this.recongizer.lang = language;
    this.recongizer.onresult = this.handleResult;
    this.recongizer.start();
    
}

InputHandler.prototype.handleResult = function(event) {
    console.log(event);
}