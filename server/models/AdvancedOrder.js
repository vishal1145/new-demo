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
    //ToDate:Date,
    OneDay:Date,
    ExtraRequire:String,
    user_by: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    // ExtraRequire : {
    //     type:Boolean,
    //     default:true
    // }
})

mongoose.model("AdvancedOrder",AdvancedSchema)