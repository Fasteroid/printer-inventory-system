
// User or admin
function Login() {
    var username = document.getElementById("name").value
    var useremail = document.getElementById("email").value
   	var password = document.getElementById("password").value

   	for(var i = 0; i < "length"; i++) { // define length
    		if(useremail == useremail && password == password) { // check if username and password match
    			console.log(username + "successful login")
    			break
    		} else {
    			console.log('incorrect username or password')
    			}
            }
}

// Admin
function CreateUser(){
        var username = document.getElementById("name").value // who is creating a new user
    	var registerUsername = document.getElementById("email").value
    	var registerPassword = document.getElementById("password").value

    	var newUser = {
    		useremail: registerUseremail,
    		password: registerPassword
    	}
    	for(var i = 0; i < "length"; i++) { // define length
    		if(registerUseremail == useremail) {
    			alert("Choose another email, this email is taken already")
    			break
    			// check the password
    		} else if (registerPassword.length < "number") { // define number
    			alert("More characters are required")
    			break
    		} else if () {
    		// define user or admin
    		}
    	}
}

// Admin
function ModifyUser() {
        var username = document.getElementById("name").value // who is modifying a user

        var useremail = document.getElementById("email").value = ""; // enter old user email
        var newUseremail=document.getElementById("new email").value= "" ; // enter new user email
        var confirmUseremail =document.getElementById("confirm email").value=""; // confirm new user email

    	var password = document.getElementById("password").value = ""; // enter old user password
        var newPassword = document.getElementById("new password").value = "" ; // enter new user password
        var confirmPassword = document.getElementById("confirm password").value = ""; // confirm new user password

    	for(var i = 0; i < "length"; i++) { // define length
    		if(registerUseremail == useremail) {
    			alert("Choose another email, this email is taken already")
    			break
    			// check the password
    		} else if (registerPassword.length < "number") { // define number
    			alert("More characters are required")
    			break
    		} else if () {
    		// define user or admin
    		}
    	}
}

// User or admin
function PrinterReport() {
        name: " ",
        price: " ",
        serial number: " ",
        location of printer: " ",
        type of printer: " "
}

// Admin
function AddPrinter() {
        var name = document.getElementById("name").value
        var price = document.getElementById("price").value
        var serialNumber = document.getElementById("serial number").value
        var location = document.getElementById("location of printer").value
        var printerType = document.getElementById("type of printer").value
}