/*
    list.js

    Manages the printer list and addition/removal of data.
    TODO: make data here update when it updates serverside, rather than immediately.

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

if( window.origin!="null" ){ // CORS
    const Printer = require("../printer");
}

const ListHeaderHTML = document.getElementById("list-headers");
const ListInputHTML  = document.getElementById("list-inputs");
const ListHTML       = document.getElementById("list");
const ListInputs     = { };
let   Printers       = [ ];
let   FirstInput;    // will be the first input so we can focus it after adding something

class ClientPrinter extends Printer {
    constructor(data){
        super(data);
        Printers.push(this);
    }
    remove(){
        Printers = Printers.filter( item => item!=this );
    }
}

/** Used to create the HTML for entries of the printer list */
class ListEntry {
    constructor( object ){

        let self = this; // avoid confusing behavior runtime-evaluation of 'this'

        self.HTML = document.createElement("tr"); // create table row
            for ( const attribute in Printer.attributes ) {
                let value = object[attribute];
                let data = document.createElement("td"); // create table data
                    data.className = "entry";
                    data.innerText = value;
                self.HTML.append(data); // end table data
            }  
        
            let data = document.createElement("td"); // create table data
                let button = document.createElement("button"); // create button
                    button.innerText = "Remove";
                    button.onclick = function(){
                        self.HTML.remove();
                        object.remove();
                    }
            data.append(button); // end table data
        self.HTML.append(data); // end table row

    }
}

/** 
 * Adds an element to the internal list of elements from the input fields.
 * Clears the input fields.
 */
function AddListElement(){
    let data = { }
    for ( const attribute in Printer.attributes ) {
        console.log(attribute)
        let testValue = ListInputs[attribute].value
        if( testValue != "" ){ // avoid setting nonexistence
            data[attribute] = testValue;
        }
        else{
            data[attribute] = "<unset>";
        }
        ListInputs[attribute].value = ""; // clear out values as we read them
    }  
    let entry = new ListEntry( new ClientPrinter(data) );
    ListHTML.prepend( entry.HTML ); 
    FirstInput.focus();  // focus the first input so that the user can rapid-fire add stuff with tab
}


// ---------------- GENERATE LIST HEADER BUTTONS ---------------- //
for ( const attribute in Printer.attributes ) {

    let data = document.createElement("th"); // create table header
        data.innerText = Printer.attributes[attribute]; // retrieve nice names
    ListHeaderHTML.append(data); // end table header

}
let data = document.createElement("th"); // create table header 'Action' last
    data.innerText = "Action";
ListHeaderHTML.append(data); // end table header
// ------------------------------------------------------------- //


// ---------------- GENERATE LIST INPUT UTILITY ---------------- //
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
// ------------------------------------------------------------- //
