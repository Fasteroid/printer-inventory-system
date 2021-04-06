/*
    login.js

    Actually handles login

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

let CurrentUser = "guest";
let CurrentToken = "0";

/**
 * Computes a hash of `s`
 * @param {String} s string to hash
 */
 function hash(s){
    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

/**
 * Mixes `email` and `pass` "irreversably" into semi-unique user tokens
 * @param {String} email user email
 * @param {String} pass user password
 */
 function genToken(email,pass){
    return hash(email) + hash(pass);
}

/**
 * Attempts to log in with provided credentials.  Initializes the system upon success.
 */
 async function tryLogin(){

    const EmailIn = document.getElementById("login-user");
    const PasswordIn  = document.getElementById("login-pass");

    CurrentUser = EmailIn.value;
    CurrentToken = genToken(CurrentUser,PasswordIn.value)

    let request = await ServerCommand({
        command: "checkLogin"
    })
    let allowed = await request.json()
    if( allowed.allowed > 0 ){
        console.log("System Init...")
        initUsers(); // get users
        initPrinters(); // get printers
        longPolling(); // kick off long polling
        const CloseButton = document.getElementById("header-close");
        CloseButton.className = ""; // show the close button
        hideWindow();
        // do something super cool
        let msg = new SpeechSynthesisUtterance("Welcome, "+CurrentUser);
        window.speechSynthesis.speak(msg);  
    }
    else{
        const ErrorMsg = document.getElementById("login-error");
        ErrorMsg.innerText = "Login failed: Incorrect username or password."
    }

}