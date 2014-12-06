function ChatHistory() {
    this.chatBox = document.getElementsByClassName("chatbox")[0];
    this.messageTemplate = document.getElementById("messageTemplate");
}

ChatHistory.prototype.addMessageToHistory = function(username,tmessage,originalmessage) {
    var cloneElement = this.messageTemplate.cloneNode(true);
    cloneElement.className = "chatMessage";
    cloneElement.removeAttribute("id");
    cloneElement.getElementsByClassName("chatMessageUsername")[0].textContent = username;
    cloneElement.getElementsByClassName("translatedText")[0].textContent = tmessage;
    cloneElement.getElementsByClassName("textOriginal")[0].textContent = originalmessage;
    this.chatBox.appendChild(cloneElement);
    
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
}