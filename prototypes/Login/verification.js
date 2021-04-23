/*
    verification.js

    Login checker base by Javier.
    TODO: security

    First Edit:  Javier
    Authors:  Javier
*/
/** Sends a json-based request to the server
 * @param {JSON} data token, server command, additional data
 */

 async function ServerCommand(data){
    return await fetch(
        "http://68.84.141.134",
        {
            headers: {
                "content-type":"application/json",
            },
            body: JSON.stringify(data),
            method: "POST"
        }
    );
}
async function init(){

    // ask the server for the printers list, store the response in data
    let data = await ServerCommand({
        command: "getUsers"
    })

    // convert the response to a javascript object
    let json = await data.json()

    // log it to make sure it looks good
    //console.log(json)
    return json
}
async function checkPswd(){
    let users = await init()
    console.log(users);
    var password = document.getElementById("pswd").value;
    var username = document.getElementById("usrnm").value;
    
    // for(var i=0; i<users.length; i++) {
    //    if(users[i].email == username) {
    //        // __FOUND is set to the index of the element
    //        window.location = "index.html";
    //        break;
    //    }
    //    else{
    //        console.log("Cant find users")
    //   }
    // }
}
