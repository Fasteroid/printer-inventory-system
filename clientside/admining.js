/*
    admining.js

    Manages dropdown lists of users and addition/removal/modification of users

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

let Users = { };
const ModuserDropdown = document.getElementById("moduser-dropdown");
const RemuserDropdown = document.getElementById("remuser-dropdown");

/** Used to populate admin dropdown lists */
class ClientUser extends User {

    constructor(email, perms){

        super(email, perms);

        let self = this; // avoid confusing behavior runtime-evaluation of 'this'
        Users[email] = self;
        
        self.ModuserOption = document.createElement("option"); // create dropdown option
            self.ModuserOption.value = email;
            self.ModuserOption.innerText = email + ( perms? " [admin]" : " [user]");
        ModuserDropdown.append( self.ModuserOption );

        self.RemuserOption = document.createElement("option"); // create dropdown option
            self.RemuserOption.value = email;
            self.RemuserOption.innerText = email + ( perms? " [admin]" : " [user]");
        RemuserDropdown.add( self.RemuserOption );

    }

    remove(){
        console.log("yeeting user", this);
        console.log(this.ModuserOption)
        this.ModuserOption.remove();
        this.RemuserOption.remove();
        delete Users[this.email];
    }

}

/** 
 * Adds a user to the internal list of users from the input fields.
 * Clears the input fields.
 */
 function addUser(){
    const AddUserEmail = document.getElementById("adduser-user");
    const AddUserPass  = document.getElementById("adduser-pass");
    const AddUserAdmin = document.getElementById("adduser-admin");

    const ErrorMsg = document.getElementById("adduser-error");
    
    let userEmail = AddUserEmail.value;
    let userPass  = AddUserPass.value;
    let userIsAdmin  = AddUserAdmin.checked;

    if(Users[userEmail]){
        ErrorMsg.innerText = "Email already in use..."
        return; // refuse!
    }

    if(userPass.length < 8){
        ErrorMsg.innerText = "Password must be 8 or more chars..."
        return; // refuse!
    }
    
    if(userPass.search(/^[0-9!@#\$%\^\&*\)\(+=._-]/) == -1){
        ErrorMsg.innerText = "Password needs at least 1 special char or number..."
        return; // refuse!
    }


    let newUser = new User(userEmail,userIsAdmin)
    console.log(AddUserEmail)
    newUser.token = genToken(userEmail,userPass);
    ServerCommand({
        command: "createUser",
        data: newUser
    })
    AddUserEmail.value = ""
    AddUserPass.value = ""   
    hideWindow();
}

/** 
 * Modifies an existing user chosen via dropdown with new input field data
 * Clears the input fields.
 */
 async function modUser(){
    // the system will happily add a new user over an existing one, so that is what this code actually does
    const ModUserPass  = document.getElementById("moduser-pass");
    const ModUserAdmin = document.getElementById("moduser-admin");

    const ErrorMsg = document.getElementById("moduser-error");
    
    let selected = document.getElementById("remuser-dropdown").selectedIndex; // this is required because otherwise we'll still be checking the element this window has selected in window storage
    let userEmail = ModuserDropdown.options[selected].value;
    let userPass  = ModUserPass.value;
    let userIsAdmin  = ModUserAdmin.checked;

    if(userPass.length < 8){
        ErrorMsg.innerText = "password must be 8 or more chars..."
        return; // refuse!
    }

    let newUser = new User(userEmail,userIsAdmin);
    newUser.token = genToken(userEmail,userPass);

    let result = await ServerCommand({
        command: "createUser",
        data: newUser,
        modify: true
    })
    let allowed = await result.json()
    if( allowed.allowed ){
        ModUserPass.value = ""   
        hideWindow();
    }
    else{  
        const ErrorMsg = document.getElementById("moduser-error");
        ErrorMsg.innerText = "This is the root user.  You cannot de-admin the root user.";
    }
    // clearWindow(); fix moved into hideWindow
}

/** 
 * Removes a user based on what's selected in the dropdown box
 */
 async function remUser(){
    let selected = document.getElementById("remuser-dropdown").selectedIndex; // this is required because otherwise we'll still be checking the element this window has selected in window storage
    let user = RemuserDropdown.options[selected].value;
    let result = await ServerCommand({
        command: "removeUser",
        data: Users[user]
    })
    let allowed = await result.json()
    if( allowed.allowed ){
        hideWindow();
        // clearWindow(); fix moved into hideWindow
    }
    else{  
        const ErrorMsg = document.getElementById("remuser-error");
        ErrorMsg.innerText = "This is the root user.  You cannot delete the root user.";
    }
}
