/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*/

 function checkPswd() {
         var password = document.getElementById("pswd").value;
         var username = document.getElementById("usrnm").value;
         if (password == data.password && username == data.email) {
            window.location = "index.html"; // point the user to the printer list for now
        }
         else{
            alert("Passwords do not match.");
        } 
 }
