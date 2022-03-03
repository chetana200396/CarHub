var myForm=$("#question-form"),
question = $('#question_askquestion'),
errorAskQuestion = $('#error_askQuestions');
errorAskQuestion.hide();

myForm.submit(function(e) {
e.preventDefault();
let errors = []

console.log(question.val());
if(!question.val()){
    errors.push("Question cannot be empty");
}

if (question.val() == null || question.val().trim() === ''){
    errors.push("Question cannot be empty");
}

if(typeof question.val() !== 'string'){
    errors.push("Question is not String type");
}
if (errors.length > 0) {
    debugger;
    errorAskQuestion.show();
    $.each(errors, function(i, value) {
        errorAskQuestion.append(`<p>${value}</p>`)
    })
} else {
    errorAskQuestion.hide();
    this.submit();
}
})

errorAskQuestion.hide();