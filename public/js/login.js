var loginForm = $('#login-form');
var error_filer1= $('#error-div1');
error_filer1.hide();

loginForm.submit(function(event) {
    event.preventDefault();
    var uName = $('#username').val();
    var pass = $('#password').val();
    console.log(uName)
    let errors = []
    if(!uName){
        errors.push(`Username required!`);
    }
    if(!pass){
        errors.push(`Password required!`);
    }
    let userName = uName.trim();
    let username = userName.toLowerCase();
    let password = pass.trim();

    if(typeof username !== 'string' || username.length < 4 || username.indexOf(' ') >= 0){
        errors.push(`Invalid Username!`);
    }

    if(password.indexOf(' ') >=0 || password.length < 6) {
        errors.push(`Invalid password!`);
    }

    if(errors.length>0){
        $.each(errors, function(i, value) {
            error_filer1.append(`<p>${value}</p>`)
        })
        error_filer1.show();
    }else {
        error_filer1.hide();
        this.submit();
    }
})