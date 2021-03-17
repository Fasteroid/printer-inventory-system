
/** Random int between min and max */
function randint(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * A ListElement Object.
 * Pretty boring.
*/
class ListElement {

    // constructor, takes in text and a list container
    constructor(htmlContainer, text) {

        let html = document.createElement("div"); // create our list element's html
        html.className = "htmlListElement"
        html.append(text);

        let button = document.createElement("button"); // now create a button!

            button.onclick = function(){  // the button should remove this element's html from the page
                html.remove();
            }
            button.innerText = "remove"

        html.append(button); // append the button

        htmlContainer.append( html ); // finally add the html part of this garbage to the included container

        //------------------- OOP stuff goes down here -------------------
        this.html = html;

    }

    // unused, but shows how to add methods to js classes
    getHTMLObject(){
        return this.html;
    }

}

let elementListBox = document.getElementById("list-box"); // gets the object for our list container, created in index.html @ line 39

let elementList = []; // this will store our ListElements

/** Called by the add button */
function appendListElement(){
    let element = new ListElement( elementListBox, "0x" + randint(0,128).toString(16) ); // use random hex strings to look cool
}
