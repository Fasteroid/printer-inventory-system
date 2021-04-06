let ClientCommands = {

    /** Adds a printer clientside
     * @param {JSON} data Returned data from server
     */
    createUser(data){
        let newUserHTML = new ClientUser(data);
        ListHTML.prepend( newUserHTML.HTML ); 
    },

    /** Removes a printer clientside
     * @param {JSON} data Returned data from server
     */
     removeUser(data){
        User[data.email].remove();
    },

}

// merged into requesthandler clientside :)
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
    for( let email in json ){
        ClientCommands.createUser( json[email] );
    }
    
}

init();