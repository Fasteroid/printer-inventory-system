/*
    user.js

    User class for holding user data.  Shared.

    First Edit:  Javier
    Authors:  Javier, Fasteroid
*/

class User {

    /** Constructs a new user object. Don't modify anything in this class from outside. 
     * @param obj data to be turned into a user
    */
    constructor(email, perms){
        if(email){ // do nothing if noarg
            this.email = email;
            this.perms = perms;
        }
    }
    
}
module.exports = User;