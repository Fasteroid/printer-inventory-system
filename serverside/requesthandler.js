/*----------------------------------------------------------------
 *  requesthandler.js
 *  Mini Server-Side API for file storage!
 *  NOTE: Requires an API token.  Don't use without the API token.
 * 
 *  Author: Fasteroid
 *  CONTACT ME BEFORE MODIFYING THIS
----------------------------------------------------------------*/


const Files = require('fs');
const Printer = require('../printer.js');
const SECRET_API_TOKEN = Files.readFileSync('./master_key.txt');  // repo is public, not putting this in plaintext...
const TIMEOUT_INTERVAL = 5000; // refresh long polling every x ms
console.log("[COMPSCI III]: SERVERSIDE LOADED, TOKEN = "+SECRET_API_TOKEN);

    
/// DATABASE INIT
    let Database = {};
    /** Saves the database to an external file. */
    function saveDatabase() {
        Files.writeFile('./database.json', JSON.stringify(Database), function(err) {
            if( err ){ console.warn(err) }
            else{ console.log( "[COMPSCI III]: database.json saved" ) }
        });
    }
    try{
        let fileData = Files.readFileSync('./database.json');
        Database = JSON.parse(fileData);
        // both checks should pass if this is usable data
        if( !Database.users ){ throw "Missing 'users' field" }
        if( !Database.printers ){ throw "Missing 'users' field" }
        if( !Database.uuid ){ throw "Missing 'uuid' field" }
        console.log( "[COMPSCI III]: database.json loaded" )
    }
    catch(e){
        console.log("[COMPSCI III]: database.json malformed or not found, creating one...")
        Database.users = [ ];
        Database.printers = [ ];
        Database.uuid = 0;
        saveDatabase();
    }
///

class ServerPrinter extends Printer {
    /** Constructs a new printer object. Don't modify anything in this class from outside. 
     * @param obj clientside data
    */
     constructor(obj){
        Database.uuid++;
        this.uuid      = Database.uuid;
        super(obj);
    }
}

let Clients = [];

/** Sends an update to all clients */ 
function ClientCommand(upd){
    for( let id in Clients ){
        Clients[id].json(upd).status(200).send();
        delete Clients[id];
    }
}

/** Reconnects all clients */
function retry(){
    console.log("Timing out clients...")
    for( let id in Clients ){
        Clients[id].status(502).send();
        Clients[id] = null;
        delete Clients[id];
    }
}
setInterval( retry, TIMEOUT_INTERVAL ); // timeouts

let ServerCommands = {

    /** Adds a printer serverside 
     * @param {Request} req Incoming request data
     * @param {Response} res Output response data
     */
    createPrinter(req, res){
        let newPrinter = new Printer(req.json)
        Database.printers[ newPrinter.uuid ] = newPrinter; // define by UUID

        ClientCommand({
            command: "createPrinter",
            json: newPrinter
        })

        res.status(200).send();
        saveDatabase();
    },

    /** Long-polling response
     * @param {Request} req Incoming request data
     * @param {Response} res Output response data
     */
    ping(req, res){
        Clients.push(res); // the idea here is to keep Clients filled with all active clients
    }

}

/** Handler function for incoming requests
 * @param {Request} req Incoming request data
 * @param {Response} res Output response data
 */
function Handler(req, res){

    const body = req.body;

    console.log(body)
    if( body.command == undefined ){ 
        return false; // forward request to other stuff in my server box
    }
    else if( ServerCommands[body.command] ){ // hand off this request to its respective function
        ServerCommands[body.command](body, res);
    }
    else{
        res.status(500).send("bad request");
    }

    return true; // Printer System handled this request, don't pass it on!

}

module.exports = Handler;