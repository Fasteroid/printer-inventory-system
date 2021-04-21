/*
    search.js

    Manages search related stuff

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

const SearchForm   = document.getElementById("search-form");
const SearchInput  = document.getElementById("psearch");

let   SearchAttrib  = ""; // updates when radio buttons are clicked
// let   SearchText    = "";
// let   SearchTextOld = "";

// ---------------- GENERATE SEARCH RADIO BUTTONS ---------------- //
{
    let first = true;
    for ( const attribute in Printer.attributes ) {
        let label = document.createElement("label"); // create label
            label.innerText = Printer.attributes[attribute];
            let button = document.createElement("input"); // create radio button
                button.type = "radio";
                button.name = "psearch"
                button.value = attribute; // don't need nice names here
                button.onclick = function(){ research(); }
                if(first){
                    button.checked = true;
                    first = false;
                }
            label.prepend(button); // end radio button

        SearchForm.append(label); // end label

        SearchForm.append(document.createElement("br")); // add break
    }
}
// ------------------------------------------------------------- //

let SearchStack = [];

function research( ){
    let SearchAttrib = SearchForm.elements["psearch"].value;
    let SearchText = SearchInput.value.toLowerCase();
    for( uuid in Printers ){
        let printer = Printers[uuid];
        if( printer[SearchAttrib].toLowerCase().search(SearchText) != -1 ){
            printer.HTML.hidden = false;
        }
        else{
            printer.HTML.hidden = true;
        }
    }
}
