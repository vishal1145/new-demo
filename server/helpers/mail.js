var nodemailer = require('nodemailer');

var smtpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
        user: "vishal.test123456@gmail.com",
        pass: "vishal987654"
    },
    tls: {
        rejectUnauthorized: false
    }
}

let transporter = nodemailer.createTransport(smtpConfig);

exports.GetMailObject = function(to, subject, html, cc, bcc) {

    function MailException(message) {
        this.message = message;
        this.name = 'MailException';
    }

    var mailObject = {};

    if (to)
        mailObject.to = to;
    else
        throw new MailException("To field is maindatory");

    if (subject)
        mailObject.subject = subject;
    else
        throw new MailException("Subject is maindatory");

    if (html)
        mailObject.html = html;
    else
        throw new MailException("Body is maindatory");

    if (cc)
        mailObject.cc = cc;

    if (bcc)
        mailObject.bcc = bcc;

    return mailObject;
}

exports.sendEmail = function(contents, cb) {
    contents.from = "vishal.test123456@gmail.com";
    return transporter.sendMail(contents, function(error, info) {
        if (error) {
            console.log(error);
            cb({ mailsuccess: false, data: null });
        } else
            cb({ mailsuccess: true, data: info });
    });
}