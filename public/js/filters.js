var filterCity = $('#filter_city'),
    formFilter = $('#filter-form'),
    brandName = $('#filter-brand'),
    capacity = $('#filter-cap'),
    low_rate = $('#filter-rate-low'),
    high_rate = $('#filter-rate-high'),
    cityZip = $('#filter-Zip'),
    cityFromDate = $('#filter-fromDate'),
    CityToDate = $('#filter-toDate'),
    error_filer = $('#error-filer');
error_filer.hide();
formFilter.submit(function(e) {
    e.preventDefault();
    let errors = []
    console.log(filterCity.val());
    if (filterCity.val() != '' && filterCity.val().trim().length == 0) {
        errors.push('Enter a Valid City');
    }
    if (brandName.val() != '' && brandName.val().trim().length == 0) {
        errors.push(`brand name cannot be empty!`);
    }
    // console.log(capacity.val() + "---" + capacity.val() != '');
    if (capacity.val() != '') {
        if (capacity.val() === '' || parseInt(capacity.val()) <= 0) {
            errors.push(`Invalid capacity!`);
        }
    }
    if (low_rate.val() != '' && parseInt(low_rate.val()) <= 0) {
        errors.push(`Invalid low rate!`);
    }
    if (high_rate.val() != '' && parseInt(high_rate.val()) < parseInt(low_rate.val())) {
        errors.push(`Invalid high rate!`);
    }
    if (low_rate.val() != '' && !low_rate.val() || high_rate.val() != '' && !high_rate.val()) {
        errors.push(`Have to provide both High and Low Rates!`)
    }
    if (cityZip.val() != '' && cityZip.val().trim().length == 0) {
        errors.push('Enter a Valid City');
    }
    if (cityZip.val() != '' && cityZip.val().length < 5) {
        errors.push('give a valid zip!');
    }

    if (fromDate.val() != '' && toDate.val() != '') {
        var startdata_array = cityFromDate.val().split('-');
        var enddate_array = CityToDate.val().split('-');
        var startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
        var enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
        var currDate = (new Date()).getTime();
        if (enddate < startdate) {
            errors.push(`End date cannot be less than start date!`)
        }
        if (startdate < currDate && currDate - startdate > 86400000) {
            errors.push(`start date cannot be less than current date!`);
        }
    } else if (cityFromDate.val() != '' || CityToDate.val() != '') {
        errors.push(`Provide Both start and end dates`)
    }

    if (errors.length > 0) {
        error_filer.show();
        $.each(errors, function(i, value) {
            error_filer.append(`<p>${value}</p>`)
        })
    } else {
        error_filer.hide();
        this.submit();
    }


});