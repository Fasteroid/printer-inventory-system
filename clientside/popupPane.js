/*
    popupPane.js

    Manages popup related stuff

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/


var PopupContent = document.getElementById("popup-content");

/** Sets the content of the popup pane to the provided HTML
 * @param {HTMLElement} htmlContent
 */
function setPopupPane(htmlContent){
    PopupContent.replaceChild( htmlContent.cloneNode(true), PopupContent.firstChild );
    PopupContent.firstChild.hidden = false;
}

setPopupPane( document.getElementById("proof-of-concept") )
