var searchPageForm = $('#searchPageForm'),
    errorDiv_searchPage = $('#errorDivSearchPage'),
    inputSearch = $('#where_searchPage')
errorDiv_searchPage.hide();
searchPageForm.submit(function(e) {
    e.preventDefault();
    let errors = []
    if (inputSearch.val().length == 0 || inputSearch.val().trim().length == 0) {

        errors.push('Enter a Valid City');
    }
    if (errors.length > 0) {
        errorDiv_searchPage.show();
        $.each(errors, function(i, value) {
            errorDiv_searchPage.append(`<p>${value}</p>`)
        })
    } else {
        errorDiv_searchPage.hide();
        this.submit();
    }
});