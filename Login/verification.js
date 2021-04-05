/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*//** Long polling loop. Periodically refreshed by the server and supplies updates on data changes */


async function init(){

    // ask the server for the printers list, store the response in data
    let data = await ServerCommand({
        command: "getUsers"
    })

    // convert the response to a javascript object
    let json = await data.json()

    // log it to make sure it looks good
    console.log(json)

    // for every entry in the javascript object, spawn printers by calling createPrinter from ClientCommands
   /* for( let email in json ){
        ClientCommands.createUser( json[email] );
    }*/
    
}

init();
 function checkPswd() {
         var password = document.getElementById("pswd").value;
         var username = document.getElementById("usrnm").value;
         if (password == Database.pass && username == Database.email) {
            window.location = "index.html"; // point the user to the printer list for now
        }
         else{
            alert("Passwords do not match.");
        } 
 }
