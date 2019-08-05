var mongoose = require('mongoose')
var Advancedorders = mongoose.model('AdvancedOrder')
var DeliveryModel= mongoose.model('Delivery');

module.exports = function() {
    this.SENDMAIL = async function(data, options) {

        return { send: "here" };

    }

    this.DELETEPREVIOUSRECORD = async function(data, options) {
        data.allIds.forEach(element => {
            element = mongoose.Types.ObjectId(element)
        });
        return await Advancedorders.deleteMany({_id: {$in: data.allIds}})

    }


    this.DELETERECORDF = async function(data, options) {
        data.allIds.forEach(element => {
            element = mongoose.Types.ObjectId(element)
        });
        return await DeliveryModel.deleteMany({_id: {$in: data.allIds}})

    }

    // this.SENDOTP = async function(data, options) {

    //     console.log(data)
    //     return { send: "here" };

    // }

}