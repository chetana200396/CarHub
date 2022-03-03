
    var myForm=$("#landing-form");
    var sourceAddress = $('#source_Address'),
    errorsLanding = $('#error_landing');
    errorsLanding.hide();
    myForm.submit(function(e) {
    e.preventDefault();
    let errors = []

    console.log("here" ,sourceAddress.val());
    if(!sourceAddress.val()){
        errors.push("Source Address cannot be empty");
    }

    if (errors.length > 0) {
        errorsLanding.show();
        $.each(errors, function(i, value) {
            errorsLanding.append(`<p>${value}</p>`)
        })
    } else {
        errorsLanding.hide();
        this.submit();
    }
})

errorsLanding.hide();