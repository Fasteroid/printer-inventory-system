class ListElement {

    constructor(htmlRef){
        for (const attribute of PRINTER_ATTRIBUTES) {
            this[attribute] = "missing";
        }
        this.htmlRef = htmlRef;
    }

    remove(){
        this.htmlRef.remove();
    }

}


// ---------------- <GENERATE LIST HEADER BUTTONS> ---------------- //
const ListHeaderHTML = document.getElementById("list-headers")

for (const attribute of PRINTER_ATTRIBUTES) {

    let data = document.createElement("th");      // table header for <table>
    data.innerText = attribute;

    //button.onclick   = function(){
    //    // TODO: sorting functionality
    //    sortHeadersBy(attribute); 
    //}

    ListHeaderHTML.prepend(data); // prepend since we want to keep the action header at the end

}

// ---------------- <GENERATE LIST INPUT UTILITY> ---------------- //
const ListInputHTML = document.getElementById("list-inputs")
const ListInputs    = { }
let   FirstInput;   // will be the first input so we can focus it after adding something
for (const attribute of PRINTER_ATTRIBUTES) {

    let data = document.createElement("td");     // table data for <table>
    let input  = document.createElement("input");  // button to place inside it
    input.className = "tableInput"

    ListInputs[attribute] = input;  // store these for easy access later
    data.appendChild(input);      // insert our <input> into our <td>
    ListInputHTML.prepend(data);  // prepend since we want to keep the add button at the end

    FirstInput = input; // since we're prepending elements this will actually be the correct thing

}

const ListHTML = document.getElementById("list")
const List     = [ ]

/** 
 * Adds an element to the internal list of elements from the input fields.
 * Clears the input fields.
 */
function AddListElement(){

    let row = document.createElement("tr") // create new row for list
    let element = new ListElement(row);

    for (const attribute of PRINTER_ATTRIBUTES) {

        let value = ListInputs[attribute].value;
        element[attribute] = value;

        let data = document.createElement("td"); // table data for <table>
        data.className = "entry";                // format this text like the table entry boxes

        data.innerText = value;   // Add the HTML for this entry
        row.prepend(data);

        ListInputs[attribute].value = ""; // clear out the inputs as we read them
    
    }  
    List.push(element);
    ListHTML.append(row);
    FirstInput.focus();  // focus the first input so that the user can rapid-fire add stuff with tab :)

}

