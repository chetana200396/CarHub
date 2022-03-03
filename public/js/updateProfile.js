var myForm=$("#updateProfile-form"),
age= $("#age"),
phoneNumber= $("#phoneNumber"),
houseNumber= $("#houseNumber"),
street= $("#street"),
city= $("#city"),
state= $("#state"),
zip= $("#zip"),
errorUpdateProfile = $('#error_upload_profile');
errorUpdateProfile.hide();
myForm.submit(function(e) {
e.preventDefault();
let errors = []

debugger;
//Required Fields
if(!age.val()){
    errors.push("Age is required");
}
if(!phoneNumber.val()){
    errors.push("Phone Number is required!");
}
if(!houseNumber.val()){
    errors.push("House Number is required");
}
if(!street.val()){
    errors.push("Street is required");
}
if(!city.val()){
    errors.push("City is required");
}
if(!state.val()){
    errors.push("State is required");
}
if(!zip.val()){
    errors.push("Zip is required");
}

if(parseInt(age.val()) < 18){
    errors.push("You're below 18, sorry!");
}

if(phoneNumber.val().length < 10){
    errors.push.append("Invalid phone number!");
}else if(!/^\d+$/.test(phoneNumber.val())){
    errors.push.append("Invalid phone number!");
}

if (errors.length > 0) {
    errorUpdateProfile.show();
    $.each(errors, function(i, value) {
        errorUpdateProfile.append(`<p>${value}</p>`)
    })
} else {
    errorUpdateProfile.hide();
    this.submit();
}
})

errorUpdateProfile.hide();