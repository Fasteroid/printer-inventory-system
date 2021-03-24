/*
    requesthandler.js (clientside)

    Handles updates to the printer list on the client side.

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/



let ClientCommands = {

    /** Adds a printer clientside
     * @param {JSON} data Returned data from server
     */
    createPrinter(data){
        let newPrinterHTML = new ClientPrinter(data);
        ListHTML.prepend( newPrinterHTML.HTML ); 
    },

    /** Removes a printer clientside
     * @param {JSON} data Returned data from server
     */
     removePrinter(data){
        Printers[data.uuid].remove();
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
    } else {
        let json = await response.json();
        if( ClientCommands[json.command] ){ // hand off this request to its respective function
            ClientCommands[json.command](json.data);
        }
        await longPolling();
    }
    
}
longPolling();


async function init(){

    // ask the server for the printers list, store the response in data
    let data = await ServerCommand({
        command: "getPrinters"
    })

    // convert the response to a javascript object
    let json = await data.json()

    // log it to make sure it looks good
    console.log(json)

    // for every entry in the javascript object, spawn printers by calling createPrinter from ClientCommands
    for( let uuid in json ){
        ClientCommands.createPrinter( json[uuid] );
    }
    
}

init();