var mongoose = require('mongoose')

var DeliverySchema = new mongoose.Schema({

    User_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Date: Date,
    Status:String,
    Complaint:String,
})
mongoose.model('Delivery',DeliverySchema)