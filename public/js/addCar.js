(function($){
var myForm=$("#add_car");
myForm.submit(function(event){
    event.preventDefault();
    const brand_name = $("#brand_name").val();
    const color = $("#color").val();
    const number=$("#number").val();
    const capacity=$("#capacity").val();
    const rate= $("#rate").val();
    const fileUpload = $("#upload_File").val();

    $("#errors").hide();
    $("#errors").empty();
    if(!brand_name){
        $("#errors").append("<p>Please enter brand name</p>");
    }
    if(typeof(brand_name)!='string')
    {
        $("#errors").append("<p>Invalid data type of Brand Name</p>");
    }
    if(!color)
    {
        $("#errors").append("<p>Please enter color</p>");
    }
    if(typeof(color)!='string')
    {
        $("#errors").append("<p>Invalid data type of Color</p>");
    }
    if(!number)
    {
        $("#errors").append("<p>Please enter car number</p>");
    }
    if(typeof(number)!='string')
    {
        $("#errors").append("<p>Invalid data type of Car Number</p>");
    }
    if(!number.match("^[a-zA-Z0-9]*$"))
    {
        $("#errors").append("<p>Car number must consist of only alphanumeric characters</p>");
    }
    if(number && number.length!=6)
    {
        $("#errors").append("<p>Car number must contain exactly 6 alphanumeric characters</p>");
    }
    if(!rate)
    {
        $("#errors").append("<p>Please enter rate</p>");
    }
    if(!capacity)
    {
        $("#errors").append("<p>Please enter capacity</p>");
    }

    debugger;
    console.log(fileUpload);
    if(!fileUpload){
        $("#errors").append("<p>Please upload file</p>");
    }

    if( $('#errors').is(':empty') ) {
        myForm[0].submit();
    }
    else{
        $("#errors").show();
    }
})
})(window.jQuery);