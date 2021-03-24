
const fs = require('fs');
const User = require('./User');
const javier = new User('javi5@yahoo.com', 'javi5', 0)
console.log(javier.email);
fs.writeFile('userInfo.json', JSON.stringify(javier) , (err) =>{
    if(err)
        console.log(err);
    else    
        console.log('Success');
});
