var mongoose = require('mongoose')
var Advertiser = mongoose.model('User')
var Service = mongoose.model('Service')
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
            let count = await Service.count();
            let incrementedService = await Service.findByIdAndUpdate(data._id, {$set: {service_order: count}},{new: true});
            return incrementedService
        }
    };

    this.validate = async function(data) {
        return data;
    };

}