/*----------------------------------------------------------------
 *  requesthandler.js
 *  Mini Server-Side API for file storage.
 * 
 *  Authors: Fasteroid, Javier (in spirit)
 *  CONTACT FAST BEFORE MODIFYING THIS
----------------------------------------------------------------*/

const Files = require('fs');
const Printer = require('../printer.js');
const User = require('../user.js');
const TIMEOUT_INTERVAL = 5000; // refresh long polling every x ms

const PERMISSION_LEVELS = {
    getUsers: 2,
    getPrinters: 1,
    createPrinter: 2,
    createUser: 2,
    removePrinter: 2,
    removeUser: 2,
    ping: 1,
    checkLogin: 0,
}

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
    constructor(email, perms, token, root){
        super(email,perms);
        this.token = token;
        if(root){ this.root = true }
        if(email){ // do nothing if no-arg
            let checkForRoot = Database.users[this.email]
            if( checkForRoot && checkForRoot.root ){
                this.root = true;
            }
            Database.users[this.email] = this;
            saveDatabase();
        }
    }
    remove(){
        if(!this.root){
            delete Database.users[this.email];
            saveDatabase();
        }
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
                Database.printers[uuid] = cast; // stick em back in the database
            }
        }

        for( let email in Database.users ){
            if( Database.users[email] ){ // ignore anything null
                let cast = new ServerUser()
                Object.assign( cast, Database.users[email] ); // ugly hack, cast the loaded stuff to objects
                Database.users[email] = cast; // stick em back in the database
            }
        }

        console.log( "[COMPSCI III]: database.json loaded" )
    }
    catch(e){
        console.log("[COMPSCI III]: database.json error: " + e)
        Database.users = { };
        Database.printers = { };
        Database.uuid = 0; // uuid for the next printer
        new ServerUser("admin",true,454892874,true) // nobodywillguessthispassword
        saveDatabase();
    }
///

let Clients = [];

/** Sends a command to all clients, or optionally only users with the provided minimum permission ranking
 * @param {Object} update `{command: <string>, data: { <args for command> } }`
 * @param {Function} permissions recieves `permission number (0-2)`, and `user email`, return true to send and false not to.
 * Leave blank to send to everyone
*/ 
function ClientCommand(update,permissions=() => {return true}){
    for( let id in Clients ){
        if( permissions(Clients[id].perms,Clients[id].email) ){
            Clients[id].response.json(update).status(200).send();
        }
        else{
            console.log("ignored user: perms="+Clients[id].perms)
        }
        delete Clients[id];
    }
}

/** Reconnects all clients */
function retry(){
    // console.log("Timing out clients...")
    for( let id in Clients ){
        Clients[id].response.status(502).send();
        Clients[id] = null;
        delete Clients[id];
    }
}
setInterval( retry, TIMEOUT_INTERVAL ); // timeouts

/** 
 * Returns a number between 0 and 2 representing the permission level of supplied credentials & token
 * @param cred credentials object
 */
function checkCredentials(cred){
    if( cred == undefined ){ return 0 }
    let user = Database.users[cred.email];
    if( user == undefined ){ return 0 }
    if(user.token != cred.token){
        return 0; // you are not who you say you are
    }
    else{
        return 1 + ( user.perms? 1 : 0 ); // return 1 if user, 2 if admin
    }
}

/** 
 * Returns a number between 0 and 2 representing the permission level of an email, defaults to 0 if the email doesn't exist
 * @param {String} email
 * @returns credentials object
*/
function getCredentials(email){
    // this would be a 1-liner if node.js supported optional chaining!
    let user = Database.users[email]
    if( user ){
        return 1 + ( user.perms? 1 : 0 ); // return 1 if user, 2 if admin
    }
    else{
        return 0;
    }
}

const ServerCommands = {

    /** Adds a user serverside, then adds it clientside for all admins
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     createUser(body, res){
        let user = Database.users[body.data.email]
        if(user && user.root && !body.data.perms){ // prevent de-opping root
            res.json( {allowed: false} )
            .status(200)
            .send();
        }
        else{
            ClientCommand({
                command: "createUser",
                data: { email: body.data.email, perms: body.data.perms, modify: !!(Database.users[body.data.email]) } // please ignore these lines
            }, (perms,email) => { return (email==body.data.email) || (perms >= PERMISSION_LEVELS.createUser) } ); // they are actually cancer
            new ServerUser(body.data.email, body.data.perms, body.data.token); // this takes care of everything
            res.json( {allowed: true} )
            .status(200)
            .send();
        }
    },

    /** Removes a user serverside, then removes it clientside for all admins
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     removeUser(body, res){
        let user = Database.users[body.data.email]
        if(!user.root){
            user.remove();
            ClientCommand({
                command: "removeUser",
                data: { email: body.data.email, perms: body.data.perms }
            }); // alerting all clients to user deletion is fine
            res.json( {allowed: true} )
            .status(200)
            .send();
        }
        else{
            res.json( {allowed: false} )
            .status(200)
            .send();
        }
    },
    

    /** Creates a printer serverside, then creates it on all clients
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     createPrinter(body, res){
        let newPrinter = new ServerPrinter(body.data)

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

    /** Does a user have the right password?
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     checkLogin(body, res){
        let allowed = checkCredentials( body.cred )
        res.json( {allowed: allowed} )
        .status(200)
        .send()
    },

    /** Long-polling response
     * @param {JSON} body Incoming request data
     * @param {Response} res Output response data
     */
     ping(body, res){
        Clients.push( {response: res, perms: getCredentials(body.cred.email), email: body.cred.email } ); // keeps 'Clients' filled with active connections to ping back
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
        if( checkCredentials(body.cred) >= PERMISSION_LEVELS[body.command] ){
            ServerCommands[body.command](body, res);
        }
        else{
            res.status(403).send("forbidden");
        }
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
