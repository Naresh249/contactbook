function validateForm() {
    var x = document.forms["admin-login"]["username"].value;
    if (x == null || x == "") {
        alert("Username must not be empty.");
        return false;
    }
    var y = document.forms["admin-login"]["password"].value;
    if (y == null || y == "") {
        alert("password must not be empty.");
        return false;
    }
}