/*----------------------------------------------------------------
 *  
 *  requesthandler.js
 *  Mini Server-Side API for file storage!
 *  NOTE: Requires an API token.  Don't use without the API token.
 * 
 *  Author: Fasteroid
 *  CONTACT ME BEFORE MODIFYING THIS
----------------------------------------------------------------*/


const Files = require('fs');
const SECRET_API_TOKEN = Files.readFileSync('./master_key.txt');


console.log("[COMPSCI III]: SERVERSIDE LOADED, TOKEN = "+SECRET_API_TOKEN);



/** Handler function for incoming requests
 * @param {Request} req Incoming request data
 * @param {Response} res Output response data
 */
function Handler(req, res){

    const body = req.body;

    if( body.token != SECRET_API_TOKEN ){ 
        return false; // forward request to other stuff in my server box
    }

    return true; // Printer System handled this request, don't pass it on!

}

module.exports = Handler;