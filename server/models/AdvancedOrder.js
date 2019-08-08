var mongoose = require('mongoose')

var AdvancedSchema = new mongoose.Schema({
    User_Id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Date:Date,
    Quantity:String,
    FromDate:Date,
    ToDate:String,
    OneDay:Date,
    ExtraRequire:String,
    Brand:String,
    user_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

mongoose.model("AdvancedOrder",AdvancedSchema)