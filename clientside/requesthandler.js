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
        let newPrinterHTML = new ListEntry( new ClientPrinter(data) );
        ListHTML.prepend( newPrinterHTML.HTML ); 
    },

}

/** Long polling loop. Periodically refreshed by the server and supplies updates on data changes */
async function longPolling() {

    let response = await ServerCommand({
        command: "ping"
    })
    console.log(response);
  
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
