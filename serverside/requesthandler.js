/*----------------------------------------------------------------
 *  requesthandler.js
 *  Mini Server-Side API for file storage.
 *  NOTE: Requires an API token.  Don't use without the API token.
 * 
 *  Authors: Fasteroid, Javier (in spirit)
 *  CONTACT FAST BEFORE MODIFYING THIS
----------------------------------------------------------------*/


const Files = require('fs');
const Printer = require('../printer.js');
const User = require('../user.js');
const SECRET_API_TOKEN = Files.readFileSync('./master_key.txt');  // repo is public, not putting this in plaintext...
const TIMEOUT_INTERVAL = 5000; // refresh long polling every x ms
console.log("[COMPSCI III]: SERVERSIDE LOADED, TOKEN = "+SECRET_API_TOKEN);

class ServerPrinter extends Printer {
    /** Constructs a new printer object and automatically puts it in the database.
     * @param obj clientside data
    */
    constructor(obj){
        super(obj);
        if(obj){ // do nothing if no-arg
            this.uuid = Database.uuid;
            Database.uuid++;
            Database.printers[this.uuid] = this;
            saveDatabase();
        }
    }
    remove(){
        delete Database.printers[this.uuid];
        saveDatabase();
    }
}

class ServerUser extends User {
    /** Constructs a new user object and automatically puts it in the database.
     * @param {String} email email to use
     * @param {boolean} perms true if admin, false if not
     * @param {String} token hashed combination of email and pass
    */
    constructor(email, perms, token){
        super(email,perms);
        this.token = token;
        if(email){ // do nothing if no-arg
            Database.users[this.email] = this;
            saveDatabase();
        }
    }
    remove(){
        delete Database.users[this.email];
        saveDatabase();
    }
}
    
/// DATABASE INIT
    let Database = { };
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
        if( Database.users == undefined ){ throw "Missing 'users' field" }
        if( Database.printers == undefined  ){ throw "Missing 'users' field" }
        if( Database.uuid == undefined ){ throw "Missing 'uuid' field" }

        for( let uuid in Database.printers ){
            if( Database.printers[uuid] ){ // ignore anything null
                let cast = new ServerPrinter()
                Object.assign( cast, Database.printers[uuid] ); // ugly hack, cast the loaded stuff to objects
                Database.printers[uuid] = cast;
            }
        }

        for( let email in Database.users ){
            if( Database.users[email] ){ // ignore anything null
                let cast = new ServerUser()
                Object.assign( cast, Database.users[email] ); // ugly hack, cast the loaded stuff to objects
                Database.users[email] = cast;
            }
        }

        console.log( "[COMPSCI III]: database.json loaded" )
    }
    catch(e){
        console.log("[COMPSCI III]: database.json error: " + e)
        Database.users = { };
        Database.printers = { };
        Database.uuid = 0; // uuid for the next printer
        // saveDatabase();
    }
///

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
    // console.log("Timing out clients...")
    for( let id in Clients ){
        Clients[id].status(502).send();
        Clients[id] = null;
        delete Clients[id];
    }
}
setInterval( retry, TIMEOUT_INTERVAL ); // timeouts

let ServerCommands = {

    /** Adds a printer serverside, then adds it clientside for all clients
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     createUser(body, res){
        let newUser = new ServerUser(body.data.email, body.data.perms, body.data.token)
        // tell all clients to add this user
        ClientCommand({
            command: "createUser",
            data: { email: body.data.email, perms: body.data.perms }
        })
        res.status(200).send();
    },
    

    /** Creates a printer serverside, then creates it on all clients
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     createPrinter(body, res){
        let newPrinter = new ServerPrinter(body.data)
        // tell all clients to add this printer
        ClientCommand({
            command: "createPrinter",
            data: newPrinter
        })
        res.status(200).send();
    },

    /** Deletes a printer serverside, then deletes it on all clients
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     removePrinter(body, res){

        let toDelete = body.data.uuid
        Database.printers[toDelete].remove()

        ClientCommand({
            command: "removePrinter",
            data: { uuid: toDelete }
        })
        res.status(200).send();

    },

    /** Requests list of printers and adds them clientside
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     getPrinters(body, res){
        res.json(Database.printers)
        .status(200)
        .send()
    },

    /** Requests list of users and adds them clientside
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     getUsers(body, res){
        let returnData = { }
        for( let email in Database.users ){
            let user = { }
            user.email = email
            user.perms = Database.users[email].perms
            returnData[email] = user;
        }
        // sending tokens to the client is insecure and bad

        res.json(returnData)
        .status(200)
        .send()
    },

    /** Called clientside to check if we should let a user log in with the provided credentials
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     tryLogin(body, res){
        let user = Database.users[ body.data.email ]
        let allowed = { allowed: user.token == body.data.token }

        res.json(allowed)
        .status(200)
        .send()
    },

    /** Long-polling response
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     ping(body, res){
        Clients.push(res); // the idea here is to keep Clients filled with all active clients
    }

}

/** Handler function for incoming requests
 * @param {Request} req Incoming request data
 * @param {Response} res Output response data
*/
function Handler(req, res){

    const body = req.body;

    // console.log(body)

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

try { // this will work serverside
    module.exports = Handler;
}
catch(e){}