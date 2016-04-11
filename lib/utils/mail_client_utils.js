var nodemailer = require("nodemailer");


exports.sendmailer = function (from, pass, to, subject, content) {
    var transport = nodemailer.createTransport( {
        service: 'QQ',
        auth: {
            user:from,
            pass: pass
        }
    });
    var mailOptions = {
        from: from, // sender address
        to:to, // list of receivers
        subject: subject, // Subject line
        text: content, // plaintext body
        // html: '<b>你好,这是一封邮件</b>' // html body
    };
    transport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}
