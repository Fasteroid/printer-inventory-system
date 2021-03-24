/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*/
 const fs = require('fs');

 function checkPswd() {
         var password = document.getElementById("pswd").value;
         var username = document.getElementById("usrnm").value;
         fs.readFile('userInfo.json','utf8',(err, file) => {
             if (err) throw err;
             else{
                 const data =  JSON.parse(file);
                 if (password == data.password && username == data.email) {
                     window.location = "index.html"; // point the user to the printer list for now
                 }
                  else{
                     alert("Passwords do not match.");
                 }
             }
         });   
 }
