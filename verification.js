/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*/

function checkPswd() {
    var dummyPassword = "password";
    var dummyUsername = "admin";
    var password = document.getElementById("pswd").value;
    var username = document.getElementById("usrnm").value;
    if (password == dummyPassword && username == dummyUsername) {
        window.location = "index.html"; // point the user to the printer list for now
    }
    else{
        alert("Passwords do not match.");
    }
}