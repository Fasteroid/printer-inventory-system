/*
    loginlist.js

    Manages dropdown lists of users and addition/removal/modification of users

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

let Users = { };
const ModuserDropdown = document.getElementById("moduser-dropdown");
const DeluserDropdown = document.getElementById("deluser-dropdown");

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

        self.DeluserOption = document.createElement("option"); // create dropdown option
        self.DeluserOption.value = email;
        self.DeluserOption.innerText = email + ( perms? " [admin]" : " [user]");
        DeluserDropdown.append( self.DeluserOption );

    }

    remove(){
        console.log("yeeting user", this);
        this.ModuserOption.remove();
        this.DeluserOption.remove();
        delete Users[this.email];
    }

}




/** 
 * Adds an element to the internal list of elements from the input fields.
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
        ErrorMsg.innerText = "email already in use..."
        return; // refuse!
    }

    if(userPass.length < 8){
        ErrorMsg.innerText = "password must be 8 or more chars..."
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
    //hideWindow();
}