/*
    printer.js

    Printer class for holding printer data.

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

class Printer {
    /** List of attributes each printer should have, paired with 'nice names' */
    static attributes = {
        barcode:      "Bar Code",
        name:         "Name",
        category:     "Category",
        serial:       "Serial Number",
        manufacturer: "Manufacturer",
        division:     "Division",
        department:   "Department",
        campus:       "Campus",
        active:       "Active"
    }
    /** Constructs a new printer object. Don't modify anything in this class from outside. 
     * @param obj data to be turned into a printer
    */
    constructor(obj){
        for( let property in Printer.attributes ){
            this[property] = obj[property];
        }
    }
}

if( window.origin != "null" ){ // chrome
    module.exports = Printer;
}