const nodemailer = require("nodemailer");

async function sendEmail(senderEmail,recieverEmailId,subject,html){
    let user = "CarCS546Hub@gmail.com";
    let pass = "CarCS546HubGroup10";

    var transporter = nodemailer.createTransport({

    service: 'gmail',

    host: "smtp.gmail.com",

    secure: false,

    port: 587,

    auth: {user, pass},

    tls: { rejectUnauthorized: false },

  });


  var mailOptions = {

    from: senderEmail,

    to: recieverEmailId,

    subject: subject,

    html: html

  };

  let info = await transporter.sendMail(mailOptions, function (error, info) {

    if(error){
        console.log(error);
    }else{
        console.log("Message sent");
        console.log(info);
    }

  });
}



module.exports = {
    sendEmail
}