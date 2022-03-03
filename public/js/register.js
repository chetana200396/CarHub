var regForm = $('#signup-form');
var error_filer2 = $('#error-div2');
var email = $('#username');
error_filer2.hide();

regForm.submit(function(e) {
    e.preventDefault();
    var password = $('#password').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var age_reg = $('#age').val();
    var phoneNumber_reg = $('#phoneNumber').val();
    var houseNumber_reg = $('#houseNumber').val();
    var street_reg = $('#street').val();
    var city_reg = $('#city').val();
    var state_reg = $('#state').val();
    var zip_reg = $('#zip').val();
    let errors = []
    if (email.val().length == 0 || email.val().trim().length == 0) {
        errors.push(`Email required!`);
    }
    if (!password) {
        errors.push(`Password required!`);
    }
    if (!firstName) {
        errors.push(`First Name required!`);
    }
    if (!lastName) {
        errors.push(`Last Name required!`);
    }
    if (!age_reg) {
        errors.push(`Age is required!`);
    }
    if (!phoneNumber_reg) {
        errors.push(`Phone Number is required!`);
    }
    if (!houseNumber_reg) {
        errors.push(`House Number is required!`);
    }
    if (!street_reg) {
        errors.push(`Street is required`);
    }
    if (!city_reg) {
        errors.push(`City is required!`);
    }
    if (!state_reg) {
        errors.push(`State is required!`);
    }
    if (!zip_reg) {
        errors.push(`Zip is required!`);
    }
    password = password.trim();
    age_reg = parseInt(age_reg);

    if (phoneNumber_reg.length < 10) {
        errors.push(`Invalid phone number!`);
    } else if (!/^\d+$/.test(phoneNumber_reg)) {
        errors.push('Invalid phone number!');
    }

    if (age_reg < 18) {
        errors.push(`You're below 18, sorry!`);
    }

    if (!email.val().includes('@') || !email.val().includes('.com')) {
        errors.push(`Invaild Email!`);
    }

    if (password.indexOf(' ') >= 0 || password.length < 6) {
        errors.push(`Invalid password or too short password!`);
    }
    console.log(errors);
    if (errors.length > 0) {
        error_filer2.show();
        $.each(errors, function(i, value) {
            error_filer2.append(`<p>${value}</p>`)
        })
    } else {
        error_filer2.hide();
        this.submit();
    }
})