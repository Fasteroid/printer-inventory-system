

const ListHeaderHTML = document.getElementById("list-headers");
const ListInputHTML  = document.getElementById("list-inputs");
const ListHTML       = document.getElementById("list");
const ListInputs     = { };
let   Printers       = [ ];
let   FirstInput;    // will be the first input so we can focus it after adding something


/** Holds serializable data pertaining to printers */
class ListData {
    /** 
     * Creates ListData and pushes it onto `Printers`
     * Set any property on it from `PRINTER_ATTRIBUTES` 
    */
    constructor(){
        for (const attribute of PRINTER_ATTRIBUTES) {
            this[attribute] = "<unset>";
        }
        Printers.push(this);
    }

    /** Removes ListData from ListElements. */
    remove(){
        Printers = Printers.filter( item => item!=this );
    }
}

/** Used to create the HTML for entries of the printer list */
class ListEntry {
    constructor( object = new ListData() ){ // use a default ListData if one isn't provided

        let self = this; // avoid confusing behavior runtime-evaluation of 'this'

        self.HTML = document.createElement("tr"); // create table row
            for (const attribute of PRINTER_ATTRIBUTES) {
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
    let data = new ListData();
    for (const attribute of PRINTER_ATTRIBUTES) {
        let testValue = ListInputs[attribute].value
        if( testValue != "" ){ // avoid setting nonexistence
            data[attribute] = testValue;
        }
        ListInputs[attribute].value = ""; // clear out values as we read them
    }  

    let entry = new ListEntry( data )
    ListHTML.prepend( entry.HTML ); 
    FirstInput.focus();  // focus the first input so that the user can rapid-fire add stuff with tab
}


// ---------------- GENERATE LIST HEADER BUTTONS ---------------- //
for (const attribute of PRINTER_ATTRIBUTES ) {

    let data = document.createElement("th"); // create table header
        data.innerText = attribute;
    ListHeaderHTML.append(data); // end table header

}
let data = document.createElement("th"); // create table header 'Action' last
    data.innerText = "Action";
ListHeaderHTML.append(data); // end table header
// ------------------------------------------------------------- //


// ---------------- GENERATE LIST INPUT UTILITY ---------------- //
for (const attribute of PRINTER_ATTRIBUTES) {

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
