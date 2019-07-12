var mongoose = require('mongoose')
var Advertiser = mongoose.model('User')
var winston = require('winston')
var SendMail = require("../helpers/mail");
var fs = require("fs");
var applogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'applogs.log'
        })
    ]
});
module.exports = function() {
    this.PREFETCH = async function(data) {
        var password = "";
        generate()

        function randomPassword(length) {
            var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
            var pass = "";
            for (var x = 0; x < length; x++) {
                var i = Math.floor(Math.random() * chars.length);
                pass += chars.charAt(i);
            }
            return pass;
        }

        function generate() {
            password = randomPassword(10);
        }
        //data.password = "123"
        data.isverify = true
        let isExist = await Advertiser.find({ email: data.email })
        if (isExist.length == 0) {
            return data
        } else {
            throw new Error('this email already exist')
        }
    };

    this.POSTFETCH = async function(data) {

        if (data) {
            var url = process.cwd() + "/Repos" + "/registration.html";
            fs.readFile(url, function read(
                err,
                bufcontent
            ) {
                var content = bufcontent.toString();
                content = content.replace("$$email$$", data.email);
                content = content.replace("$$password$$", data.password);
                var mailObject = SendMail.GetMailObject(
                    data.email,
                    "Created account",
                    content,
                    null,
                    null
                );
                applogger.info('send mail')
                SendMail.sendEmail(mailObject, function(res) {
                    console.log(res);
                });
            });
            return data
        }
    };

    this.validate = async function(data) {
        return data;
    };

}