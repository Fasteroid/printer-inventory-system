/*
    user.js

    User class for holding user data.  Shared.

    First Edit:  Javier
    Authors:  Javier
*/

class User {
    constructor(email, password, permission){
        if(email){ // do nothing if noarg
            this.email = email;
            this.password = password;
            this.permission = permission;
        }
    }
}
module.exports = User;