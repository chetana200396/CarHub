var booking_form = $('#book-form'),
    fromDate = $('#fromDate_book'),
    toDate = $('#toDate_book'),
    errorDiv = $('#error_bookings');
errorDiv.hide();
booking_form.submit(function(e) {
    e.preventDefault();
    let errors = []

    if (fromDate.val() != '' && toDate.val() != '') {
        var startdata_array = fromDate.val().split('-');
        var enddate_array = toDate.val().split('-');
        var startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
        var enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
        var currDate = (new Date()).getTime();
        if (enddate < startdate) {
            errors.push(`End date cannot be less than start date!`)
        }
        if (startdate < currDate && currDate - startdate > 86400000) {
            errors.push(`start date cannot be less than current date!`);
        }
    } else if (fromDate.val() != '' || toDate.val() != '') {
        errors.push(`Provide Both start and end dates`)
    }

    if (errors.length > 0) {
        errorDiv.show();
        $.each(errors, function(i, value) {
            errorDiv.append(`<p>${value}</p>`)
        })
    } else {
        errorDiv.hide();
        this.submit();
    }
})

errorDiv.hide();