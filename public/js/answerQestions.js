var myForm=$("#answer-form"),
answer = $('#answer_answerquestion'),
errorAnswerQuestion = $('#error_answerQuestions');
errorAnswerQuestion.hide();

myForm.submit(function(e) {
e.preventDefault();
let errors = []

debugger;
if(!answer.val()){
    errors.push("Answer cannot be empty");
}

if (answer.val() == null || answer.val().trim() === ''){
    errors.push("Answer cannot be empty");
}

if(typeof answer.val() !=='string'){
    errors.push("Answer is not String type");
}

if (errors.length > 0) {
    errorAnswerQuestion.show();
    $.each(errors, function(i, value) {
        errorAnswerQuestion.append(`<p>${value}</p>`)
    })
} else {
    errorAnswerQuestion.hide();
    this.submit();
}
})

errorAnswerQuestion.hide();