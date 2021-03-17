function checkPswd() {
    var dummyPassword = "password";
    var dummyUsername = "admin";
    var password = document.getElementById("pswd").value;
    var username = document.getElementById("usrnm").value;
    if (password == dummyPassword && username == dummyUsername) {
         window.location="index.html";
    }
    else{
        alert("Passwords do not match.");
    }
}