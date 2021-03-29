const ListHeaderHTML = document.getElementById("list-headers");
const ListInputHTML  = document.getElementById("list-inputs");
const ListHTML       = document.getElementById("list");
const ListInputs     = { };
let   Users       = [ ];
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
class ClientUser extends User {
    constructor(object){

        super(object);
        this.email = object.email;
        let self = this; // avoid confusing behavior runtime-evaluation of 'this'

        Users[object.email] = self;

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
                    console.log(self)
                    button.onclick = function(){
                        ServerCommand({
                            command: "removePrinter",
                            data: { email: self.email }
                        })
                    }
            data.append(button); // end table data
        self.HTML.append(data); // end table row

    }

    remove(){
        console.log("yeeting printer", this)
        this.HTML.remove();
        delete Users[this.email];
    }

}

/** 
 * Adds an element to the internal list of elements from the input fields.
 * Clears the input fields.
 */
function AddListElement(){
    let data = { }
    for ( const attribute in User.attributes ) {
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
        command: "createUser",
        data: data
    })
    FirstInput.focus();  // focus the first input so that the user can rapid-fire add stuff with tab
}


// ---------------- GENERATE LIST HEADER BUTTONS ---------------- //
for ( const attribute in User.attributes ) {

    let data = document.createElement("th"); // create table header
        data.innerText = User.attributes[attribute]; // retrieve nice names
    ListHeaderHTML.append(data); // end table header

}
let data = document.createElement("th"); // create table header 'Action' last
    data.innerText = "Action";
ListHeaderHTML.append(data); // end table header
// ------------------------------------------------------------- //


// ---------------- GENERATE LIST INPUT UTILITY ---------------- //
for ( const attribute in User.attributes ) {

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