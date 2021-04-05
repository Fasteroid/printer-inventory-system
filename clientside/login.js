/*
    login.js

    Manages client-side log-in stuff and user creation/deletion

    First Edit:  Fasteroid
    Authors:  Fasteroid
*/

let Users = { };
const ModuserDropdown = document.getElementById("moduser-dropdown");
const DeluserDropdown = document.getElementById("deluser-dropdown");

/**
 * Computes a hash of `s`
 * @param {String} s string to hash
 */
function cursed_hash(s){
    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

/** Used to populate admin dropdown lists */
class ClientUser extends User {
    constructor(email, perms){

        super(email, perms);

        let self = this; // avoid confusing behavior runtime-evaluation of 'this'
        Users[email] = self;

        self.Moduser = document.createElement("option"); // create dropdown option
            for ( const attribute in Printer.attributes ) {
                let value = object[attribute];
                let data = document.createElement("td"); // create table data
                    data.className = "entry";
                    data.innerText = value;
                self.HTML.append(data); // end table data
            }  
        
            let data = document.createElement("td"); // create table data
                let button = document.createElement("button"); // create button
                    button.innerText = "Remove";
                    console.log(self)
                    button.onclick = function(){
                        ServerCommand({
                            command: "removePrinter",
                            data: { uuid: self.uuid }
                        })
                    }
            data.append(button); // end table data
        self.HTML.append(data); // end table row

    }

    remove(){
        console.log("yeeting user", this);
        this.Moduser.remove();
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
    newUser.token = cursed_hash(userEmail) + cursed_hash(userPass);
    console.log(newUser.token)
    ServerCommand({
        command: "createUser",
        data: newUser
    })
    AddUserEmail.value = ""
    AddUserPass.value = ""   
    //hideWindow();
}