var mongoose = require('mongoose')

var AdvancedSchema = new mongoose.Schema({
    User_Id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Date:Date,
    Quantity:String,
    FromDate:String,
    ToDate:Date,
    OneDay:Date,
})

mongoose.model("AdvancedOrder",AdvancedSchema)