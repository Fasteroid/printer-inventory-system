/*
    popupPane.js

    Manages popup related stuff

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/


var WindowContent   = document.getElementById("window-content");
const WindowOverlay = document.getElementById("window-pane");
const WindowName    = document.getElementById("window-title");

/** Takes in a window name and displays a window with it
 * @param {String} name - name of the window
 */
function setWindow(name) {
    let window = document.getElementById(name + "-window");
    WindowContent.replaceChild( window.cloneNode(true), WindowContent.firstChild );
    // no need to unhide these anymore since they're all stored in a hidden div :)
}

setWindow( "Login" )
