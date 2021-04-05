/*
    login.js

    Manages client-side log-in stuff and user creation/deletion

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
 const AddUserEmail = document.getElementById("adduser-user");
 const AddUserPass  = document.getElementById("adduser-pass");
 const AddUserAdmin = document.getElementById("adduser-admin");
 function addUser(){
    let userEmail = AddUserEmail.value;
    let userPass  = AddUserPass.value;
    ServerCommand({
        command: "createUser",
        data: data
    })
}