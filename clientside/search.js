/*
    search.js

    Manages search related stuff

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

const SearchForm = document.getElementById("search-form");

// ---------------- GENERATE SEARCH RADIO BUTTONS ---------------- //
for ( const attribute in Printer.attributes ) {

    let button = document.createElement("input"); // create radio button
        button.type = "radio";
        button.name = "psearch";
        button.value = attribute; // don't need nice names here
    SearchForm.append(button); // end radio button

}
// ------------------------------------------------------------- //