/*----------------------------------------------------------------
 *  index.js
 *  Run this in node on your server.  Not exactly what I used,
 *  but should work well enough.
 * 
 *  Authors: Fasteroid
----------------------------------------------------------------*/

const express    = require('express'); // Make sure you npm install express or none of this will work
const Net        = express();
const bodyParser = require('body-parser');
const PrinterSystem = require('./requesthandler.js');

// not sure what most of this does, but it's needed to make the bodies accessable
Net.use(bodyParser.urlencoded({ extended: true }));
Net.use(bodyParser.json());
Net.use(bodyParser.raw());

Net.use(function(req, res, next) {
    try{
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS",)
        next();
    }
    catch(e){
        console.log("Headers choked, oops")
    }
});

Net.post('/', function(req, res){ // on post recieved do this
    if( PrinterSystem(req,res) ){ return }
})