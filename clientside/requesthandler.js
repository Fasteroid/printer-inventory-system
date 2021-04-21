/*
    requesthandler.js (clientside)

    Handles updates to the printer list on the client side.

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

/** Sends a json-based request to the server
 * @param {JSON} data token, server command, additional data
 */
 async function ServerCommand(data){
    data.cred = { }
    data.cred.email = CurrentUser;
    data.cred.token = CurrentToken;
    const stringified = JSON.stringify(data)
    // console.log(stringified)
    return await fetch(
        "http://68.84.141.134",
        {
            headers: {
                "content-type":"application/json",
            },
            body: stringified,
            method: "POST"
        }
    );
}

let ClientCommands = {

    /** Adds a printer clientside
     * @param {JSON} data Returned data from server
     */
    createPrinter(data){
        new ClientPrinter(data);  // automatically edits clientside data
    },

    /** Removes a printer clientside
     * @param {JSON} data Returned data from server
     */
     removePrinter(data){
        Printers[data.uuid].remove();
    },

    /** Adds a user clientside
     * @param {JSON} data Returned data from server
     */
     createUser(data){
        if( data.modify && CurrentUser == data.email ){
            location.reload(); // not dealing with users changing themselves, just force reload the window
        }
        new ClientUser(data.email, data.perms); // automatically edits clientside data
    },

    /** Removes a printer clientside
     * @param {JSON} data Returned data from server
     */
     removeUser(data){
        if( CurrentUser == data.email ){
            location.reload(); // not dealing with users changing themselves, just force reload the window
        }
        Users[data.email].remove();
    },

}

/** Long polling loop. Periodically refreshed by the server and supplies updates on data changes */
async function longPolling() {

    let response = await ServerCommand({
        command: "ping"
    })
  
    if (response.status == 502) {
        // Status 502 is a connection timeout error, refresh the connection and try again!
        await longPolling();
        return;
    } else {
        let json = await response.json();
        if( ClientCommands[json.command] ){ // hand off this request to its respective function
            ClientCommands[json.command](json.data);
        }
        await longPolling();
        return;
    }
    
}

async function initPrinters(){

    // ask the server for the printers list, store the response in data
    let data = await ServerCommand({
        command: "getPrinters"
    })

    // convert the response to a javascript object
    let json = await data.json()

    // log it to make sure it looks good
    // console.log(json)

    // for every entry in the javascript object, spawn printers by calling createPrinter from ClientCommands
    for( let uuid in json ){
        ClientCommands.createPrinter( json[uuid] );
    }
    
}

async function initUsers(){

    // ask the server for the users list, store the response in data
    let data = await ServerCommand({
        command: "getUsers"
    })

    // convert the response to a javascript object
    let json = await data.json()

    // log it to make sure it looks good
    // console.log(json)

    // for every entry in the javascript object, spawn printers by calling createPrinter from ClientCommands
    for( let email in json ){
        ClientCommands.createUser( json[email] );
    }
    
}
