/*
    windows.js

    Manages popup related stuff

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/


const WindowContent = document.getElementById("window-content");
const WindowOverlay = document.getElementById("window-pane");
const WindowName    = document.getElementById("window-title");

/** Selects the content to display in the popup window
 * @param {String} name - name of the content
 */
function setWindow(content) {
    const window = document.getElementById(content + "-window");
    WindowContent.replaceChild( window.cloneNode(true), WindowContent.firstChild );
    WindowName.innerText = content;
    // no need to unhide these anymore since they're all stored in a hidden div :)
}

/** Clears the popup window's contents and replaces it with [data expunged] to [redacted]
 *  Pretty good for solving UI-related bugs
 */
function clearWindow() {
    WindowContent.replaceChild( document.createElement("div"), WindowContent.firstChild );
    WindowName.innerText = "lol";
    // no need to unhide these anymore since they're all stored in a hidden div :)
}

/** Hides the popup window */
function hideWindow() {
    WindowOverlay.className = "hidden"
    clearWindow();
}

/** Shows the popup window */
function showWindow() {
    WindowOverlay.className = ""
}

/** Selects and shows content in the popup window
 * @param {String} content - name of the content
 */
function popWindow(content){
    setWindow(content);
    showWindow();
}

popWindow("Login");