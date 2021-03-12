const HEADERS = document.getElementById("table-header-box")

// fill in the list headers after the page loads
for (const key in PRINTER_ATTRIBUTES) {
    let headerTitle = PRINTER_ATTRIBUTES[key];
    let header = document.createElement("th"); // table header
    let clickable = document.createElement("button"); // table header
    clickable.className = "tableHeader";
    clickable.id        = headerTitle;
    clickable.innerText = headerTitle;
    clickable.onclick   = function(){
        // TODO: sorting functionality
        sortHeadersBy(headerTitle); 
    }
    header.appendChild(clickable);
    HEADERS.prepend(header); // prepend since we want to keep the action header at the end
}
