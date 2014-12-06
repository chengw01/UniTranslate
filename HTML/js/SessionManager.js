function SessionManager(c,u,l) {
    //If we're not passing anything to constrctor
    //that means we want to load from session store
    if (!c && sessionStorage.getItem("channel")) {
        this.channel = sessionStorage.getItem("channel");
        this.username = sessionStorage.getItem("username");
        this.language = sessionStorage.getItem("language");
    }else if (c) {
        this.channel = c;
        this.username = u;
        this.language = l;

        this.saveToSessionStorage();

    }else{
        console.log("you fail");
    }
}

SessionManager.prototype.addUserToSession = function() {
    
}

//Saves the current session to SessionStorage
SessionManager.prototype.saveToSessionStorage = function() {
    sessionStorage.setItem("channel",this.channel);
    sessionStorage.setItem("username",this.username);
    sessionStorage.setItem("language",this.language);
}