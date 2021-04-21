async function tryLogin2(){

    CurrentUser = "admin";
    CurrentToken = genToken("admin","nobodywillguessthispassword")

    let request = await ServerCommand({
        command: "checkLogin"
    })
    let allowed = await request.json()
    if( allowed.allowed > 0 ){
        console.log("System Init...")
        if(allowed.allowed == 2){
            IsAdmin = true;
            const AdminButtons  = document.getElementById("admin-panel");
            AdminButtons.hidden = false;
            // do something super cool
            let msg = new SpeechSynthesisUtterance("Welcome, "+CurrentUser);
            window.speechSynthesis.speak(msg);  
        }
        initPrinterList(); // this has to be after we set IsAdmin to true for admins
        initUsers(); // get users
        initPrinters(); // get printers
        longPolling(); // kick off long polling
        hideWindow();
        const CloseButton = document.getElementById("header-close");
        CloseButton.className = ""; // show the close button, wasn't unhiding for some reason
    }
    else{
        const ErrorMsg = document.getElementById("login-error");
        ErrorMsg.innerText = "Login failed: Incorrect username or password."
    }

}
setTimeout(tryLogin2,100);