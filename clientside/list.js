/*
    list.js

    Manages the printer list's HTML components.

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

const ListHTML       = document.getElementById("list");
const ListHeaderHTML = document.getElementById("list-headers");
const ListInputHTML  = document.getElementById("list-inputs");
const ListInputs     = { }; // holds the printer entry fields for admins
let   Printers       = [ ]; // holds ClientPrinters
let   FirstInput;    // will be the first input so we can focus it after adding something


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

/** Used to create the HTML for entries of the printer list */
class ClientPrinter extends Printer {
    constructor(object){

        super(object);
        this.uuid = object.uuid;
        let self = this; // avoid confusing behavior runtime-evaluation of 'this'

        Printers[object.uuid] = self;

        self.HTML = document.createElement("tr"); // create table row
            for ( const attribute in Printer.attributes ) {
                let value = object[attribute];
                let data = document.createElement("td"); // create table data
                    data.className = "entry";
                    data.innerText = value;
                self.HTML.append(data); // end table data
            }  
            if( IsAdmin ){ // only show the remove buttons if the user is an admin
                let data = document.createElement("td"); // create table data
                    let button = document.createElement("button"); // create button
                        button.innerText = "Remove";
                        console.log(self)
                        button.onclick = function(){
                            ServerCommand({
                                command: "removePrinter",
                                data: { uuid: self.uuid }
                            })
                        }
                    data.append(button); // end table data
                self.HTML.append(data); // end table row
            }

        ListHTML.prepend( self.HTML ); 
    }

    remove(){
        console.log("yeeting printer", this)
        this.HTML.remove();
        delete Printers[this.uuid];
    }
}

/** 
 * Adds an element to the internal list of printers from the input fields.
 * Clears the input fields.
 */
function AddListElement(){
    let data = { }
    for ( const attribute in Printer.attributes ) {
        let testValue = ListInputs[attribute].value
        if( testValue != "" ){ // avoid setting nonexistence
            data[attribute] = testValue;
        }
        else{
            data[attribute] = "<unset>";
        }
        ListInputs[attribute].value = ""; // clear out values as we read them
    }  
    ServerCommand({
        command: "createPrinter",
        data: data
    })
    FirstInput.focus();  // focus the first input so that the user can rapid-fire add stuff with tab
}

/** 
 * Called to initialize the printer list.
 * Should be called before adding printers or unexpected bugs may occur on client-side
 */
function initPrinterList(){

    // ---------------- GENERATE LIST HEADER BUTTONS ---------------- //
    for ( const attribute in Printer.attributes ) {
        let data = document.createElement("th"); // create table header
            data.innerText = Printer.attributes[attribute]; // retrieve nice names
        ListHeaderHTML.append(data); // end table header
    }
    if( IsAdmin ){
        let data = document.createElement("th"); // create table header 'Action' last
            data.innerText = "Action";
        ListHeaderHTML.append(data); // end table header
    }
    // ------------------------------------------------------------- //


    // ---------------- GENERATE LIST INPUT UTILITY ---------------- //
    if( IsAdmin ){
        for ( const attribute in Printer.attributes ) {

            let data = document.createElement("td"); // create table data
                let input  = document.createElement("input");  // create input
                    input.className = "tableInput"
                data.append(input); // end input input
            ListInputHTML.append(data); // end table data
            
            ListInputs[attribute] = input;  // store these for easy access later
            if( FirstInput == undefined ){ // snag first input
                FirstInput = input;
            }
            
        }
        let button = document.createElement("button") // create 'Add' button last
            button.onclick = AddListElement;
            button.innerText = "Add"
        ListInputHTML.append(button); // end button
    }
    // ------------------------------------------------------------- //
}
