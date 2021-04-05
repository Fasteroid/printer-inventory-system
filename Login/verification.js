/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*//** Long polling loop. Periodically refreshed by the server and supplies updates on data changes */
 function checkPswd() {
         var password = document.getElementById("pswd").value;
         var username = document.getElementById("usrnm").value;
         if (password == Database.token && username == Database.email) {
            window.location = "index.html"; // point the user to the printer list for now
        }
         else{
            alert("Passwords do not match.");
        } 
 }
