/*
    user.js

    User class for holding user data.  Shared.

    First Edit:  Javier
    Authors:  Javier
*/

class User {

    // constructor(email, password, permission){
    //     if(email){ // do nothing if noarg
    //         this.email = email;
    //         this.password = password;
    //         this.permission = permission;
    //     }
    // }
    static attributes = {
        email:      "Email",
        password:    "Password",
        permission:     "Permission",
    }
    /** Constructs a new printer object. Don't modify anything in this class from outside. 
     * @param obj data to be turned into a printer
    */
    constructor(obj = {}){
        for( let property in User.attributes ){
            this[property] = obj[property];
        }
    }
}
module.exports = User;